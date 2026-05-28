import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const [isLogged, setIsLogged] = useState(null);
  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [showRooms, setShowRooms] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLogged(false);
      return;
    }

    try {
      const res = await axios.get("http://localhost:8001/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data);
      setIsLogged(true);
    } catch (err) {
      localStorage.removeItem("token");
      setIsLogged(false);
    }
  };

  const loadRooms = async () => {
    try {
      const res = await axios.get("http://localhost:8004/rooms");
      setRooms(res.data);
      setShowRooms(true);
    } catch (err) {
      console.log("ROOM ERROR:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLogged(false);
    setUser(null);
    setRooms([]);
    setShowRooms(false);
  };

  const reserveRoom = async (roomId) => {
    try {
      await axios.post(
        "http://localhost:8003/reservations",
        {
          room_id: roomId,
          start_time: new Date().toISOString(),
          end_time: new Date(Date.now() + 3600000).toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Zarezerwowano pokój!");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.detail || "Błąd rezerwacji");
    }
  };

  if (isLogged === null) {
    return <h2>Loading...</h2>;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Hotel System</h1>

      {/* AUTH */}
      {!isLogged ? (
        <div>
          <h2>Nie jesteś zalogowany</h2>

          <Link to="/login">
            <button>Login</button>
          </Link>

          <Link to="/register">
            <button style={{ marginLeft: "10px" }}>
              Register
            </button>
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px",
          }}
        >
          <div>
            <h2>Zalogowano</h2>
            <p>Witaj {user?.username}</p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => navigate("/my-reservations")}>
              Moje rezerwacje
            </button>

            {user?.role === "admin" && (
              <button onClick={() => navigate("/my-rooms")}>
                Moje obiekty
              </button>
            )}

            <button onClick={logout}>
              Wyloguj
            </button>
          </div>
        </div>
      )}

      <hr />

      {/* ROOMS */}
      <h2>Pokoje</h2>

      <button onClick={loadRooms}>
        Zobacz dostępne pokoje
      </button>

      {showRooms && (
        <div style={{ marginTop: "20px" }}>
          {rooms.length === 0 ? (
            <p>Brak pokoi</p>
          ) : (
            rooms.map((room) => (
              <div
                key={room.id}
                style={{
                  border: "1px solid gray",
                  padding: "10px",
                  margin: "10px auto",
                  width: "300px",
                  borderRadius: "8px",
                }}
              >
                <h3>{room.name}</h3>
                <p>Pojemność: {room.capacity}</p>

                {isLogged && (
                  <button onClick={() => navigate(`/reserve/${room.id}`)}>
                    Zarezerwuj
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}