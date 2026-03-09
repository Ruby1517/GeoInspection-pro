from collections.abc import Generator
from pathlib import Path
import sys

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app.api.deps import get_db
from app.core.security import hash_password
from app.main import app
from app.models import Base
from app.models.category import Category
from app.models.enums import UserRole
from app.models.user import User

TEST_DATABASE_URL = "postgresql+psycopg2://postgres:postgres@localhost:5432/geoinspection_test"

engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db() -> Generator:
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_database():
    with engine.begin() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis"))

    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = TestingSessionLocal()

    admin = User(
        full_name="Admin User",
        email="admin@example.com",
        password_hash=hash_password("Admin123!"),
        role=UserRole.ADMIN,
    )
    inspector = User(
        full_name="Inspector User",
        email="inspector@example.com",
        password_hash=hash_password("Inspector123!"),
        role=UserRole.INSPECTOR,
    )
    supervisor = User(
        full_name="Supervisor User",
        email="supervisor@example.com",
        password_hash=hash_password("Supervisor123!"),
        role=UserRole.SUPERVISOR,
    )
    contractor = User(
        full_name="Contractor User",
        email="contractor@example.com",
        password_hash=hash_password("Contractor123!"),
        role=UserRole.CONTRACTOR,
    )

    db.add_all([admin, inspector, supervisor, contractor])
    db.commit()

    category = Category(
        name="Pothole",
        description="Road surface damage",
    )
    db.add(category)
    db.commit()
    db.close()

    yield

    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    return TestClient(app)
