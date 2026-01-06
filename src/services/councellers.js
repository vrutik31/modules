import axios from "axios";

const api = axios.create({
  baseURL: "https://adminapi.digiteachindia.com/", // ← replace
});

export default api;
