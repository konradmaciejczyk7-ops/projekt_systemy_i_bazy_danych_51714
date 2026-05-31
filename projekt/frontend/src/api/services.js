import { reservationApi, userApi } from "./axios";


export const getReservations = async () => {
  const res = await reservationApi.get("/reservations");
  return res.data;
};

export const cancelReservation = async (id) => {
  const res = await reservationApi.put(`/reservations/${id}/cancel`);
  return res.data;
};


export const loginUser = async (data) => {
  const res = await userApi.post("/login", data);
  return res.data;
};

export const registerUser = async (data) => {
  const res = await userApi.post("/register", data);
  return res.data;
};