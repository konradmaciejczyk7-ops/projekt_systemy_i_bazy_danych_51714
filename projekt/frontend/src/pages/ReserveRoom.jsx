import { useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function ReserveRoom() {
  const { roomId } = useParams();

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const reserve = async () => {
    try {
      await axios.post(
        "http://localhost:8003/reservations",
        {
          room_id: Number(roomId),
          start_time: new Date(startTime).toISOString(),
          end_time: new Date(endTime).toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Zarezerwowano!");
    } catch (err) {
      console.log("RESERVATION ERROR:", err.response?.data || err);
      alert(err.response?.data?.detail || "Błąd rezerwacji");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Rezerwacja pokoju {roomId}</h2>

      <div>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>

      <br />

      <div>
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>

      <br />

      <button onClick={reserve}>
        Potwierdź rezerwację
      </button>
    </div>
  );
}