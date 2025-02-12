"""initial

Revision ID: 001
Revises:
Create Date: 2025-02-12 10:00:00.000000

"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create vacation_total table
    op.create_table(
        "vacation_total",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("total_hours", sa.Float(), nullable=False),
        sa.Column("year", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )

    # Create vacation_days table
    op.create_table(
        "vacation_days",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("date", sa.Date(), nullable=False),
        sa.Column("hours", sa.Float(), nullable=False),
        sa.Column("confirmed", sa.Boolean(), default=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("vacation_days")
    op.drop_table("vacation_total")
