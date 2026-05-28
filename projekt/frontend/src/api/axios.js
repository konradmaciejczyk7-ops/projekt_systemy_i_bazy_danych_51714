import axios from "axios";

export const reservationApi = axios.create({
  baseURL: "http://localhost:8003",
});

export const roomApi = axios.create({
  baseURL: "http://localhost:8004",
});

export const userApi = axios.create({
  baseURL: "http://localhost:8001",
});