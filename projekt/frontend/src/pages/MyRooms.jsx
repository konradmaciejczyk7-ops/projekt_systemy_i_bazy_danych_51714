import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MyRooms() {
  const [rooms, setRooms] = useState([]);
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);

  const changeStatus = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:8004/rooms/${id}/status?status=${status}`
      );

      loadRooms();
      setOpenMenuId(null);
    } catch (err) {
      console.log(err);
      alert("Błąd zmiany statusu");
    }
  };

  const loadRooms = async () => {
    try {
      const res = await axios.get("http://localhost:8004/rooms");
      setRooms(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const createRoom = async () => {
    try {
      await axios.post(
        "http://localhost:8004/rooms",
        {
          name,
          capacity: Number(capacity),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setName("");
      setCapacity(1);
      loadRooms();
    } catch (err) {
      console.log(err);
      alert("Błąd tworzenia pokoju");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>🏢 Moje obiekty</h2>

      {/* CREATE ROOM */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Nazwa pokoju"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Pojemność"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
        />

        <button onClick={createRoom}>Dodaj pokój</button>
      </div>

      {/* LIST */}
      {rooms.map((r) => (
        <div
          key={r.id}
          style={{
            border: "1px solid gray",
            margin: "10px auto",
            width: "300px",
            padding: "10px",
            borderRadius: "8px",
            position: "relative",
            opacity: r.status === "inactive" ? 0.5 : 1,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "8px",
              right: "10px",
              cursor: "pointer",
              fontSize: "20px",
            }}
            onClick={() =>
              setOpenMenuId(openMenuId === r.id ? null : r.id)
            }
          >
            ⋮
          </div>

          {openMenuId === r.id && (
            <div
              style={{
                position: "absolute",
                top: "30px",
                right: "10px",
                background: "white",
                border: "1px solid gray",
                borderRadius: "6px",
                padding: "5px",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                zIndex: 100,
              }}
            >
              <button onClick={() => changeStatus(r.id, "active")}>
                Aktywuj
              </button>

              <button onClick={() => changeStatus(r.id, "suspended")}>
                Zawieś
              </button>

            </div>
          )}

          <h3>{r.name}</h3>
          <p>Pojemność: {r.capacity}</p>

          <p>
            Status:{" "}
            {r.status === "active" && "🟢 aktywny"}
            {r.status === "suspended" && "🟡 zawieszony"}
            {r.status === "inactive" && "🔴 wycofany"}
          </p>
        </div>))}
      </div>
    );
}