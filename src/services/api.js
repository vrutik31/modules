import axios from "axios";

const api = axios.create({
  baseURL: "https://adminapi.hayatplus.online/", 
});

export default api;
