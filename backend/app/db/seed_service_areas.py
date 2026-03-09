from sqlalchemy import text

from app.db.session import SessionLocal


def seed_service_areas():
    db = SessionLocal()

    existing = db.execute(text("SELECT id FROM service_areas LIMIT 1")).first()
    if existing:
        print("Service areas already seeded.")
        db.close()
        return

    areas = [
        {
            "name": "Central Fresno Zone",
            "description": "Core service area around central Fresno",
            "wkt": "POLYGON((-119.81 36.72, -119.76 36.72, -119.76 36.76, -119.81 36.76, -119.81 36.72))",
        },
        {
            "name": "Northwest Fresno Zone",
            "description": "Northwest response area",
            "wkt": "POLYGON((-119.84 36.75, -119.78 36.75, -119.78 36.80, -119.84 36.80, -119.84 36.75))",
        },
    ]

    for area in areas:
        db.execute(
            text(
                """
                INSERT INTO service_areas (name, description, boundary, created_at)
                VALUES (
                    :name,
                    :description,
                    ST_GeomFromText(:wkt, 4326),
                    NOW()
                )
                """
            ),
            area,
        )

    db.commit()
    db.close()
    print("Seeded service areas successfully.")


if __name__ == "__main__":
    seed_service_areas()