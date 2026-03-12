"""add notes to inspections

Revision ID: 8d3ace81fe4f
Revises: 2675a4b0dd4d
Create Date: 2026-03-09 16:22:50.666067

"""

from typing import Sequence, Union

from alembic import op
import geoalchemy2
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "8d3ace81fe4f"
down_revision: Union[str, Sequence[str], None] = "2675a4b0dd4d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "parcels",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("apn", sa.String(length=50), nullable=False),
        sa.Column("zoning_code", sa.String(length=50), nullable=True),
        sa.Column("owner_name", sa.String(length=255), nullable=True),
        sa.Column("address", sa.String(length=255), nullable=True),
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
    op.create_index(op.f("ix_parcels_id"), "parcels", ["id"], unique=False)
    op.create_index(op.f("ix_parcels_apn"), "parcels", ["apn"], unique=True)

    op.add_column("inspections", sa.Column("parcel_id", sa.Integer(), nullable=True))
    op.create_foreign_key(
        "fk_inspections_parcel_id_parcels",
        "inspections",
        "parcels",
        ["parcel_id"],
        ["id"],
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint("fk_inspections_parcel_id_parcels", "inspections", type_="foreignkey")
    op.drop_column("inspections", "parcel_id")

    op.drop_index(op.f("ix_parcels_apn"), table_name="parcels")
    op.drop_index(op.f("ix_parcels_id"), table_name="parcels")
    op.drop_table("parcels")
