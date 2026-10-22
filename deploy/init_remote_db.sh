#!/usr/bin/env bash
set -e

echo "=================================================="
echo " Initializing PostgreSQL Database: keras_db"
echo " User: sage_user | Password: kerash#shop"
echo "=================================================="

sudo -u postgres psql << 'EOF'
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'sage_user') THEN
    CREATE ROLE sage_user LOGIN PASSWORD 'kerash#shop';
  ELSE
    ALTER ROLE sage_user WITH PASSWORD 'kerash#shop';
  END IF;
END
$$;

SELECT 'CREATE DATABASE keras_db OWNER sage_user'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'keras_db')\gexec

GRANT ALL PRIVILEGES ON DATABASE keras_db TO sage_user;
EOF

sudo -u postgres psql -d keras_db << 'EOF'
GRANT ALL ON SCHEMA public TO sage_user;
ALTER SCHEMA public OWNER TO sage_user;
EOF

echo "✅ Database keras_db and user sage_user ready."

