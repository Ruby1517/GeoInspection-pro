from sqlalchemy import text

from tests.conftest import TestingSessionLocal


def test_inspector_can_create_inspection(client):
    login_response = client.post(
        "/auth/login",
        data={
            "username": "inspector@example.com",
            "password": "Inspector123!",
        },
    )
    token = login_response.json()["access_token"]

    response = client.post(
        "/inspections/",
        json={
            "title": "Large pothole near school",
            "description": "Deep pothole causing traffic issues",
            "category_id": 1,
            "priority": "high",
            "status": "open",
            "address": "123 Main St, Fresno, CA",
            "latitude": 36.7378,
            "longitude": -119.7871,
            "assigned_to": 4,
        },
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Large pothole near school"
    assert data["inspection_number"].startswith("GI-")


def test_inspector_list_only_own_inspections(client):
    login_response = client.post(
        "/auth/login",
        data={
            "username": "inspector@example.com",
            "password": "Inspector123!",
        },
    )
    token = login_response.json()["access_token"]

    create_response = client.post(
        "/inspections/",
        json={
            "title": "Inspection A",
            "description": "Test",
            "category_id": 1,
            "priority": "medium",
            "status": "open",
            "address": "A Street",
            "latitude": 36.7378,
            "longitude": -119.7871,
            "assigned_to": 4,
        },
        headers={"Authorization": f"Bearer {token}"},
    )

    assert create_response.status_code == 201

    list_response = client.get(
        "/inspections/",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert list_response.status_code == 200
    data = list_response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Inspection A"


def test_nearby_search_returns_created_inspection(client):
    login_response = client.post(
        "/auth/login",
        data={
            "username": "inspector@example.com",
            "password": "Inspector123!",
        },
    )
    token = login_response.json()["access_token"]

    create_response = client.post(
        "/inspections/",
        json={
            "title": "Nearby Test",
            "description": "Nearby inspection",
            "category_id": 1,
            "priority": "medium",
            "status": "open",
            "address": "Near Fresno",
            "latitude": 36.7378,
            "longitude": -119.7871,
            "assigned_to": 4,
        },
        headers={"Authorization": f"Bearer {token}"},
    )

    assert create_response.status_code == 201

    nearby_response = client.get(
        "/inspections/nearby?lat=36.7378&lng=-119.7871&radius_meters=1000",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert nearby_response.status_code == 200
    data = nearby_response.json()
    assert len(data) >= 1
    assert data[0]["title"] == "Nearby Test"
    assert "distance_meters" in data[0]