import pytest
from app.services.storage import StorageService


def test_generate_safe_filename():
    service = StorageService()
    name = service.generate_safe_filename("پیراهن ابریشم زنانه_v1.PNG", default_stem="product")
    assert name.endswith(".webp")
    assert "v1" in name or "product" in name


@pytest.mark.asyncio
async def test_local_fallback_when_disabled():
    service = StorageService()
    service.enabled = False
    content = b"Local storage fallback test"
    filename = "test-fallback-image.webp"
    url = await service.upload_file(content, filename, subfolder="test")
    assert url == f"/images/test/{filename}"

