import { useEffect, useState } from "react";
import axios from "axios";

const formatDate = (date) =>
  new Date(date).toLocaleString("pl-PL", {
    timeZone: "Europe/Warsaw",
  });

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editId, setEditId] = useState(null);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [hideCancelled, setHideCancelled] = useState(false);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const res = await axios.get("http://localhost:8003/reservations", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setReservations(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const cancelReservation = async (id) => {
    try {
      await axios.patch(
        `http://localhost:8003/reservations/${id}`,
        { status: "cancelled" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      loadReservations();
    } catch (err) {
      console.log(err);
    }
  };

  const updateTimes = async (id) => {
    try {
      if (!startTime || !endTime) return;

      const start = new Date(startTime);
      const end = new Date(endTime);

      if (end <= start) {
        alert("Koniec musi być po starcie");
        return;
      }

      if (end - start > 7 * 24 * 60 * 60 * 1000) {
        alert("Maksymalnie 7 dni");
        return;
      }

      await axios.patch(
        `http://localhost:8003/reservations/${id}`,
        {
          start_time: startTime,
          end_time: endTime,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setEditId(null);
      loadReservations();
    } catch (err) {
      console.log(err);
    }
  };

  const filtered = hideCancelled
    ? reservations.filter((r) => r.status !== "cancelled")
    : reservations;

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "420px",
          margin: "0 auto 20px auto",
        }}
      >
        <h2 style={{ margin: 0 }}>Moje rezerwacje</h2>

        <label style={{ fontSize: "14px" }}>
          <input
            type="checkbox"
            checked={hideCancelled}
            onChange={(e) => setHideCancelled(e.target.checked)}
          />
          Ukryj anulowane
        </label>
      </div>

      {filtered.length === 0 ? (
        <p>Brak rezerwacji</p>
      ) : (
        filtered.map((r) => (
          <div
            key={r.id}
            style={{
              border: "1px solid gray",
              padding: "10px",
              margin: "10px auto",
              width: "420px",
              borderRadius: "8px",
              position: "relative",
              background: r.status === "cancelled" ? "#f5f5f5" : "white",
              opacity: r.status === "cancelled" ? 0.6 : 1,
            }}
          >
            <div
              style={{
                position: "absolute",
                right: "10px",
                top: "10px",
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
                  right: "10px",
                  top: "35px",
                  background: "white",
                  border: "1px solid gray",
                  borderRadius: "6px",
                  padding: "5px",
                  zIndex: 100,
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }}
              >
                <button
                  onClick={() => {
                    setEditId(r.id);
                    setStartTime(r.start_time.slice(0, 16));
                    setEndTime(r.end_time.slice(0, 16));
                    setOpenMenuId(null);
                  }}
                >
                  Zmień godziny
                </button>

                <button onClick={() => cancelReservation(r.id)}>
                  Anuluj
                </button>
              </div>
            )}

            <h3>{r.room_name}</h3>

            <p>Od: {formatDate(r.start_time)}</p>
            <p>Do: {formatDate(r.end_time)}</p>

            <p>Status: {r.status}</p>

            {editId === r.id && (
              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <div>
                  <p>Start</p>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>

                <div>
                  <p>Koniec</p>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>

                <button onClick={() => updateTimes(r.id)}>
                  Zapisz
                </button>

                <button onClick={() => setEditId(null)}>
                  Anuluj
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}