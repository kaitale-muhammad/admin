import axios from "axios";

// Create an instance of Axios
const api = axios.create({
  baseURL: "https://backendpsl.up.railway.app", // https://backendpsl.up.railway.app/
});

export default api;
