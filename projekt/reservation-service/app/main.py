from fastapi import FastAPI, Depends, HTTPException, Header, Security
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.reservation import Reservation
from app.schemas import ReservationCreate, ReservationUpdate
from app.auth import decode_access_token
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from datetime import timedelta
import requests

security = HTTPBearer()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/reservations")
def create_reservation(
    data: ReservationCreate,
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    start = data.start_time
    end = data.end_time
    if not authorization:
        raise HTTPException(status_code=401, detail="No token")

    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)

    room_resp = requests.get(f"http://room-service:8000/rooms/{data.room_id}")

    if room_resp.status_code != 200:
        raise HTTPException(status_code=400, detail="Room not found or room-service error")

    room = room_resp.json()

    print("ROOM DEBUG:", room)

    if room.get("status", "").lower() != "active":
        raise HTTPException(status_code=400, detail="Room is not available")

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id = int(payload["sub"])

    start = data.start_time
    end = data.end_time

    if end <= start:
        raise HTTPException(status_code=400, detail="End time must be after start time")

    if end - start > timedelta(days=7):
        raise HTTPException(status_code=400, detail="Max 7 days")

    conflict = db.query(Reservation).filter(
        Reservation.room_id == data.room_id,
        Reservation.start_time < end,
        Reservation.end_time > start,
        Reservation.status == "active"
    ).first()

    if conflict:
        raise HTTPException(status_code=400, detail="Room is already reserved")

    reservation = Reservation(
        user_id=user_id,
        room_id=data.room_id,
        start_time=start,
        end_time=end,
        status="active"
    )

    db.add(reservation)
    db.commit()
    db.refresh(reservation)

    return reservation




@app.get("/reservations")
def get_reservations(
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    if not authorization:
        return []

    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)

    if not payload:
        return []

    user_id = int(payload["sub"])

    reservations = db.query(Reservation).filter(
        Reservation.user_id == user_id
    ).all()

    result = []

    for r in reservations:
        try:
            room = requests.get(f"http://room-service:8000/rooms/{r.room_id}").json()
            room_name = room.get("name", "Unknown")
        except:
            room_name = "Unknown"

        result.append({
            "id": r.id,
            "room_name": room_name,
            "start_time": r.start_time,
            "end_time": r.end_time,
            "status": r.status
        })

    return result



@app.patch("/reservations/{reservation_id}")
def update_reservation(
    reservation_id: int,
    data: ReservationUpdate,
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    if not authorization:
        raise HTTPException(status_code=401)

    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(status_code=401)

    user_id = int(payload["sub"])

    reservation = db.query(Reservation).filter(
        Reservation.id == reservation_id,
        Reservation.user_id == user_id
    ).first()

    if not reservation:
        raise HTTPException(status_code=404, detail="Not found")

    if data.room_id is not None:
        reservation.room_id = data.room_id

    if data.start_time is not None:
        reservation.start_time = data.start_time

    if data.end_time is not None:
        reservation.end_time = data.end_time

    if data.status is not None:
        reservation.status = data.status

    db.commit()
    db.refresh(reservation)

    return reservation



@app.get("/admin/reservations")
def get_all_reservations(
    credentials=Security(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    print("PAYLOAD:", payload)


    return db.query(Reservation).all()

@app.get("/debug-token")
def debug(credentials=Security(security)):
    token = credentials.credentials
    return decode_access_token(token)