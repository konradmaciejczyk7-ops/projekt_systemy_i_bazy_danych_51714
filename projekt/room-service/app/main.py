from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import Base, engine, SessionLocal
from app.models.room import Room
from app.schemas import RoomCreate
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

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


@app.post("/rooms")
def create_room(room: RoomCreate, db: Session = Depends(get_db)):

    existing = db.query(Room).filter(Room.name == room.name).first()

    if existing:
        raise HTTPException(status_code=400, detail="Room already exists")

    new_room = Room(
        name=room.name,
        capacity=room.capacity,
        status="active"
    )

    db.add(new_room)
    db.commit()
    db.refresh(new_room)

    return new_room



@app.get("/rooms")
def get_rooms(db: Session = Depends(get_db)):
    return db.query(Room).filter(Room.status == "active").all()




@app.get("/rooms/{room_id}")
def get_room(room_id: int, db: Session = Depends(get_db)):

    room = db.query(Room).filter(Room.id == room_id).first()

    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    return {
        "id": room.id,
        "name": room.name,
        "capacity": room.capacity,
        "status": room.status
    }

@app.patch("/rooms/{room_id}/status")
def update_room_status(
    room_id: int,
    status: str = Query(...),
    db: Session = Depends(get_db)
):

    room = db.query(Room).filter(Room.id == room_id).first()

    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    status = status.lower()

    if status not in ["active", "suspended", "inactive"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    room.status = status

    db.commit()
    db.refresh(room)

    return {
        "id": room.id,
        "status": room.status
    }