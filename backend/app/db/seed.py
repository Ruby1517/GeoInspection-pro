from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models.enums import UserRole
from app.models.user import User


def seed_users():
    db = SessionLocal()

    existing = db.query(User).first()
    if existing:
        print("Users already seeded.")
        db.close()
        return

    users = [
        User(
            full_name="Admin User",
            email="admin@example.com",
            password_hash=hash_password("Admin123!"),
            role=UserRole.ADMIN,
        ),
        User(
            full_name="Inspector User",
            email="inspector@example.com",
            password_hash=hash_password("Inspector123!"),
            role=UserRole.INSPECTOR,
        ),
        User(
            full_name="Supervisor User",
            email="supervisor@example.com",
            password_hash=hash_password("Supervisor123!"),
            role=UserRole.SUPERVISOR,
        ),
        User(
            full_name="Contractor User",
            email="contractor@example.com",
            password_hash=hash_password("Contractor123!"),
            role=UserRole.CONTRACTOR,
        ),
    ]

    db.add_all(users)
    db.commit()
    db.close()

    print("Seeded users successfully.")


if __name__ == "__main__":
    seed_users()