def test_login_success(client):
    response = client.post(
        "/auth/login",
        data={
            "username": "inspector@example.com",
            "password": "Inspector123!",
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_password(client):
    response = client.post(
        "/auth/login",
        data={
            "username": "inspector@example.com",
            "password": "WrongPassword",
        },
    )

    assert response.status_code == 401


def test_read_me(client):
    login_response = client.post(
        "/auth/login",
        data={
            "username": "inspector@example.com",
            "password": "Inspector123!",
        },
    )

    token = login_response.json()["access_token"]

    response = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "inspector@example.com"
    assert data["role"] == "inspector"