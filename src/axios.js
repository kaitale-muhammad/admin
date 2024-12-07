import axios from "axios";

// Create an instance of Axios
const api = axios.create({
  baseURL: "backend-production-2194.up.railway.app", // https://backendpsl.up.railway.app/
});
export const baseUrl = "backend-production-2194.up.railway.app";
export default api;
