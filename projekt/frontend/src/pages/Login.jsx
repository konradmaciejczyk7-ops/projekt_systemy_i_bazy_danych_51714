import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("EMAIL:", email);
    console.log("PASSWORD:", password);

    try {
      const res = await axios.post(
        "http://localhost:8001/auth/login",
        {
         email,
         password,
        }
      );

      console.log("RESPONSE:", res.data);

      localStorage.setItem("token", res.data.access_token);

      navigate("/");
    } catch (err) {
      console.log("ERROR:", err.response);

      alert("Błędne dane logowania");
    }
  };
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <br />
        <br />

        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
}