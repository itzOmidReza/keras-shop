import asyncio
import ftplib
import io
import logging
from pathlib import Path
import re
import time
import uuid

from app.core.config import settings

logger = logging.getLogger("sage.storage")


class StorageService:
    def __init__(self):
        self.enabled = settings.STORAGE_ENABLED
        self.storage_type = settings.STORAGE_TYPE.lower()
        self.host = settings.STORAGE_HOST
        self.port = settings.STORAGE_PORT
        self.username = settings.STORAGE_USERNAME
        self.password = settings.STORAGE_PASSWORD
        self.base_path = settings.STORAGE_BASE_PATH.strip("/")
        self.cdn_url = settings.STORAGE_CDN_URL.rstrip("/")

    def generate_safe_filename(self, original_filename: str, default_stem: str = "media") -> str:
        """Sanitizes filename and appends timestamp + unique hash with .webp extension."""
        original_stem = Path(original_filename).stem.lower()
        safe_stem = re.sub(r"[^a-z0-9_-]", "-", original_stem)
        safe_stem = re.sub(r"-+", "-", safe_stem).strip("-") or default_stem
        unique_suffix = f"{int(time.time() * 1000)}-{uuid.uuid4().hex[:8]}"
        return f"{safe_stem}-{unique_suffix}.webp"

    def _sync_ftp_upload(self, file_content: bytes, filename: str, subfolder: str = "products") -> str:
        """Synchronous worker that connects to FTP and writes file."""
        ftp = ftplib.FTP(timeout=15)
        try:
            logger.info(f"Connecting to FTP storage server {self.host}:{self.port}...")
            ftp.connect(self.host, self.port)
            ftp.login(self.username, self.password)
            ftp.set_pasv(True)

            # Build remote directory segments (e.g. ['public_html', 'products'])
            segments = [seg for seg in self.base_path.split("/") if seg]
            # If base_path does not already end with subfolder, append it
            if subfolder and (not segments or segments[-1] != subfolder):
                segments.append(subfolder)

            for segment in segments:
                try:
                    ftp.cwd(segment)
                except Exception:
                    # Directory might not exist, create it then cwd
                    try:
                        ftp.mkd(segment)
                    except Exception as mkd_err:
                        logger.debug(f"Directory {segment} may already exist or cannot be created: {mkd_err}")
                    ftp.cwd(segment)

            # Store the binary content
            bio = io.BytesIO(file_content)
            ftp.storbinary(f"STOR {filename}", bio)
            logger.info(f"Successfully uploaded {filename} to FTP server at {'/'.join(segments)}")

            # Construct public CDN URL
            public_url = f"{self.cdn_url}/{subfolder}/{filename}"
            return public_url
        finally:
            try:
                ftp.quit()
            except Exception:
                pass

    def _sync_local_upload(self, file_content: bytes, filename: str, subfolder: str = "products") -> str:
        """Fallback to local disk storage if FTP is disabled or fails."""
        backend_dir = Path(__file__).resolve().parents[2]
        target_dir = backend_dir / "public" / "images" / subfolder
        target_dir.mkdir(parents=True, exist_ok=True)
        target_path = target_dir / filename

        with open(target_path, "wb") as f:
            f.write(file_content)

        logger.info(f"Stored file locally at {target_path}")
        return f"/images/{subfolder}/{filename}"

    async def upload_file(self, file_content: bytes, filename: str, subfolder: str = "products") -> str:
        """Uploads file to remote storage (FTP) or falls back to local storage."""
        if self.enabled and self.host and self.username and self.storage_type == "ftp":
            try:
                return await asyncio.to_thread(self._sync_ftp_upload, file_content, filename, subfolder)
            except Exception as exc:
                logger.error(f"FTP upload failed for {filename}: {exc}. Falling back to local storage.")
                return await asyncio.to_thread(self._sync_local_upload, file_content, filename, subfolder)
        else:
            return await asyncio.to_thread(self._sync_local_upload, file_content, filename, subfolder)


storage_service = StorageService()

