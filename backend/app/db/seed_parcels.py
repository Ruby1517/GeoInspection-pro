from sqlalchemy import text

from app.db.session import SessionLocal


def seed_parcels():
    db = SessionLocal()

    existing = db.execute(text("SELECT id FROM parcels LIMIT 1")).first()
    if existing:
        print("Parcels already seeded.")
        db.close()
        return

    parcels = [
        {
            "apn": "101-000-001",
            "zoning_code": "R1",
            "owner_name": "City Owner A",
            "address": "100 Parcel Ave, Fresno, CA",
            "description": "Residential parcel A",
            "wkt": "POLYGON((-119.7900 36.7350, -119.7850 36.7350, -119.7850 36.7400, -119.7900 36.7400, -119.7900 36.7350))",
        },
        {
            "apn": "101-000-002",
            "zoning_code": "C2",
            "owner_name": "City Owner B",
            "address": "200 Parcel Ave, Fresno, CA",
            "description": "Commercial parcel B",
            "wkt": "POLYGON((-119.7850 36.7350, -119.7800 36.7350, -119.7800 36.7400, -119.7850 36.7400, -119.7850 36.7350))",
        },
        {
            "apn": "101-000-003",
            "zoning_code": "M1",
            "owner_name": "City Owner C",
            "address": "300 Parcel Ave, Fresno, CA",
            "description": "Industrial parcel C",
            "wkt": "POLYGON((-119.7900 36.7400, -119.7800 36.7400, -119.7800 36.7450, -119.7900 36.7450, -119.7900 36.7400))",
        },
    ]

    for parcel in parcels:
        db.execute(
            text(
                """
                INSERT INTO parcels (
                    apn, zoning_code, owner_name, address, description, boundary, created_at
                )
                VALUES (
                    :apn,
                    :zoning_code,
                    :owner_name,
                    :address,
                    :description,
                    ST_GeomFromText(:wkt, 4326),
                    NOW()
                )
                """
            ),
            parcel,
        )

    db.commit()
    db.close()
    print("Seeded parcels successfully.")


if __name__ == "__main__":
    seed_parcels()