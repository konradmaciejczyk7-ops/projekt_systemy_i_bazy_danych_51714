import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReserveRoom from "./pages/ReserveRoom";
import MyReservations from "./pages/MyReservations";
import MyRooms from "./pages/MyRooms";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-reservations" element={<MyReservations />} />
        <Route path="/my-rooms" element={<MyRooms />} />

        {/* 🔥 NOWA STRONA */}
        <Route path="/reserve/:roomId" element={<ReserveRoom />} />
      </Routes>
    </BrowserRouter>
  );
}