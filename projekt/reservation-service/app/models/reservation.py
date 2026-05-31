from sqlalchemy import Column, Integer, DateTime, String
from datetime import datetime
from app.database import Base


class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, nullable=False)
    room_id = Column(Integer, nullable=False)

    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)

    status = Column(String, default="active")


    created_at = Column(DateTime, default=datetime.utcnow)