def test_admin_can_create_category(client):
    login_response = client.post(
        "/auth/login",
        data={
            "username": "admin@example.com",
            "password": "Admin123!",
        },
    )
    token = login_response.json()["access_token"]

    response = client.post(
        "/categories/",
        json={
            "name": "Graffiti",
            "description": "Wall defacement",
        },
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Graffiti"


def test_inspector_cannot_create_category(client):
    login_response = client.post(
        "/auth/login",
        data={
            "username": "inspector@example.com",
            "password": "Inspector123!",
        },
    )
    token = login_response.json()["access_token"]

    response = client.post(
        "/categories/",
        json={
            "name": "Electrical",
            "description": "Electrical issue",
        },
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 403