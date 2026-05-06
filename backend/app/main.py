from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "System rezerwacji sal działa"}

@app.get("/status") #test
def status():
    return {
        "app": "rezerwacja sal",
        "status": "dziala",
        "autor": "Konrad",
        "version": "0.1"
    }

@app.get("/rooms") #pokoje lista
def get_rooms():
    return [
        {"id": 1, "name": "Sala konferencyjna A"},
        {"id": 2, "name": "Sala szkoleniowa B"}
    ]


@app.get("/reservations") #rezerwacja lista
def get_reservations():
    return reservations

@app.get("/events") #eventy lista
def get_events():
    return [
        {"id": 1, "name": "Konferencja IT"},
        {"id": 2, "name": "Warsztaty Python"}
    ]


@app.post("/reservations")
def create_reservation(reservation: dict):
    room_id = reservation.get("room_id")
    date = reservation.get("date")
    user_id = reservation.get("user_id")

    # sprawdzenie konfliktu
    for r in reservations:
        if r["room_id"] == room_id and r["date"] == date:
            return {"error": "Sala zajęta"}

    new_res = {
        "id": len(reservations) + 1,
        "room_id": room_id,
        "date": date,
        "user_id": user_id
    }

    reservations.append(new_res)

    return {
        "message": "OK - rezerwacja dodana",
        "data": new_res
    }

users = [
    {"id": 1, "name": "Konrad"}
]

reservations = []