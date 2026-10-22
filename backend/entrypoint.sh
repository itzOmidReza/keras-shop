#!/bin/sh
set -e

# Wait for PostgreSQL to accept connections (max ~60s)
python - <<'PY'
import asyncio
from sqlalchemy import text
from app.db.session import async_engine


async def wait_for_db() -> int:
    for attempt in range(30):
        try:
            async with async_engine.connect() as conn:
                await conn.execute(text("SELECT 1"))
            return 0
        except Exception as exc:
            print(f"Database unavailable ({exc.__class__.__name__}), retrying in 2s...")
            await asyncio.sleep(2)
    return 1


raise SystemExit(asyncio.run(wait_for_db()))
PY

echo "Applying database migrations..."
alembic upgrade head

echo "Seeding initial Keras Atelier data..."
python -m app.db.seed || true

echo "Starting Sage E-Commerce API..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
