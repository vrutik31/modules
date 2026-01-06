import axios from "axios";

export const BASE_URL = "http://codingcloud.pythonanywhere.com";

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
