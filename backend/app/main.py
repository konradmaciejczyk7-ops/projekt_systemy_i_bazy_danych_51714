from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "System rezerwacji sal działa"}

@app.get("/rooms")
def get_rooms():
    return [
        {"id": 1, "name": "Sala konferencyjna A"},
        {"id": 2, "name": "Sala szkoleniowa B"}
    ]

@app.get("/events")
def get_events():
    return [
        {"id": 1, "name": "Konferencja IT"},
        {"id": 2, "name": "Warsztaty Python"}
    ]