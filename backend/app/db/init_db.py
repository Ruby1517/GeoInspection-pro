from app.db.session import engine
from app.models import Base
from app.models.category import Category
from app.models.inspection import Inspection
from app.models.service_area import ServiceArea
from app.models.user import User


def init_db():
    Base.metadata.create_all(bind=engine)