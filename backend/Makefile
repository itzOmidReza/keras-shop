.PHONY: check migration-check migrate revision run test

# Check for schema drift between SQLAlchemy models and Alembic migrations.
# Exits non-zero if current DB head differs from models.
check: migration-check

migration-check:
	alembic check

migrate:
	alembic upgrade head

# Generate a new migration if models changed
revision:
	alembic revision --autogenerate -m "$(m)"

run:
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

test:
	pytest

