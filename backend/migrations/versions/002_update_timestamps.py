"""update timestamps

Revision ID: 002
Revises: 001
Create Date: 2025-02-12 11:00:00.000000
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import text

# revision identifiers, used by Alembic.
revision = "002"
down_revision = "001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # First update existing NULL values
    op.execute(
        text(
            "UPDATE vacation_total SET created_at = CURRENT_TIMESTAMP, "
            "updated_at = CURRENT_TIMESTAMP WHERE created_at IS NULL"
        )
    )
    op.execute(
        text(
            "UPDATE vacation_days SET created_at = CURRENT_TIMESTAMP, "
            "updated_at = CURRENT_TIMESTAMP WHERE created_at IS NULL"
        )
    )

    # Update vacation_total table
    op.alter_column(
        "vacation_total",
        "created_at",
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
        type_=sa.DateTime(timezone=True),
    )
    op.alter_column(
        "vacation_total",
        "updated_at",
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
        type_=sa.DateTime(timezone=True),
    )

    # Update vacation_days table
    op.alter_column(
        "vacation_days",
        "created_at",
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
        type_=sa.DateTime(timezone=True),
    )
    op.alter_column(
        "vacation_days",
        "updated_at",
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
        type_=sa.DateTime(timezone=True),
    )
