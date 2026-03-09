"""initial schema

Revision ID: 2675a4b0dd4d
Revises:
Create Date: 2026-03-09 11:14:53.287139
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
import geoalchemy2

# revision identifiers, used by Alembic.
revision: str = "2675a4b0dd4d"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


user_role_enum = postgresql.ENUM(
    "ADMIN",
    "INSPECTOR",
    "SUPERVISOR",
    "CONTRACTOR",
    name="user_role",
    create_type=False,  # Don't create the type immediately
)

inspection_priority_enum = postgresql.ENUM(
    "low",
    "medium",
    "high",
    "critical",
    name="inspection_priority",
    create_type=False,  # Don't create the type immediately
)

inspection_status_enum = postgresql.ENUM(
    "open",
    "in_review",
    "assigned",
    "in_progress",
    "resolved",
    "closed",
    name="inspection_status",
    create_type=False,  # Don't create the type immediately
)


def upgrade() -> None:
    """Upgrade schema."""

    user_role_enum.create(op.get_bind(), checkfirst=True)
    inspection_priority_enum.create(op.get_bind(), checkfirst=True)
    inspection_status_enum.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "categories",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_categories_id"), "categories", ["id"], unique=False)
    op.create_index(op.f("ix_categories_name"), "categories", ["name"], unique=True)

    op.create_table(
        "service_areas",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=150), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column(
            "boundary",
            geoalchemy2.types.Geometry(
                geometry_type="POLYGON",
                srid=4326,
                dimension=2,
                from_text="ST_GeomFromEWKT",
                name="geometry",
            ),
            nullable=False,
        ),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_service_areas_id"), "service_areas", ["id"], unique=False)
    op.create_index(op.f("ix_service_areas_name"), "service_areas", ["name"], unique=True)

    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("role", user_role_enum, nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_users_id"), "users", ["id"], unique=False)
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)

    op.create_table(
        "inspections",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("inspection_number", sa.String(length=50), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("category_id", sa.Integer(), nullable=False),
        sa.Column("priority", inspection_priority_enum, nullable=False),
        sa.Column("status", inspection_status_enum, nullable=False),
        sa.Column("address", sa.String(length=255), nullable=True),
        sa.Column("latitude", sa.Numeric(precision=9, scale=6), nullable=True),
        sa.Column("longitude", sa.Numeric(precision=9, scale=6), nullable=True),
        sa.Column(
            "location",
            geoalchemy2.types.Geometry(
                geometry_type="POINT",
                srid=4326,
                dimension=2,
                from_text="ST_GeomFromEWKT",
                name="geometry",
            ),
            nullable=False,
        ),
        sa.Column("created_by", sa.Integer(), nullable=False),
        sa.Column("assigned_to", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["assigned_to"], ["users.id"]),
        sa.ForeignKeyConstraint(["category_id"], ["categories.id"]),
        sa.ForeignKeyConstraint(["created_by"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_inspections_id"), "inspections", ["id"], unique=False)
    op.create_index(
        op.f("ix_inspections_inspection_number"),
        "inspections",
        ["inspection_number"],
        unique=True,
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_index(op.f("ix_inspections_inspection_number"), table_name="inspections")
    op.drop_index(op.f("ix_inspections_id"), table_name="inspections")
    op.drop_table("inspections")

    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_index(op.f("ix_users_id"), table_name="users")
    op.drop_table("users")

    op.drop_index(op.f("ix_service_areas_name"), table_name="service_areas")
    op.drop_index(op.f("ix_service_areas_id"), table_name="service_areas")
    op.drop_table("service_areas")

    op.drop_index(op.f("ix_categories_name"), table_name="categories")
    op.drop_index(op.f("ix_categories_id"), table_name="categories")
    op.drop_table("categories")

    inspection_status_enum.drop(op.get_bind(), checkfirst=True)
    inspection_priority_enum.drop(op.get_bind(), checkfirst=True)
    user_role_enum.drop(op.get_bind(), checkfirst=True)
