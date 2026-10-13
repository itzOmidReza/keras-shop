"""add pre_order to fulfillment_type_enum

Revision ID: e1f2a3b4c5d6
Revises: 0c67bab03dc4
Create Date: 2026-09-12 21:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e1f2a3b4c5d6'
down_revision: Union[str, None] = '0c67bab03dc4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # In PostgreSQL, ALTER TYPE ... ADD VALUE cannot run inside a multi-statement transaction block
    with op.get_context().autocommit_block():
        op.execute("ALTER TYPE fulfillment_type_enum ADD VALUE IF NOT EXISTS 'PRE_ORDER'")


def downgrade() -> None:
    # PostgreSQL does not support removing values from enums without dropping and recreating the type
    pass

