from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base


class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, unique=True, nullable=False)
    capacity = Column(Integer, nullable=False)

    status = Column(String, default="active")