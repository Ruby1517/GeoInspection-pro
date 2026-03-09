from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api.routes.auth import router as auth_router
from app.api.routes.categories import router as categories_router
from app.api.routes.inspections import router as inspections_router
from app.api.routes.service_areas import router as service_areas_router
from app.db.init_db import init_db
from app.db.session import engine

app = FastAPI(title="GeoInspection Pro API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "GeoInspection Pro API is running"}


@app.get("/health/db")
def db_health():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        value = result.scalar()

    return {"database": "connected", "result": value}


app.include_router(auth_router)
app.include_router(categories_router)
app.include_router(inspections_router)
app.include_router(service_areas_router)