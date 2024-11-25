import axios from "axios";

// Create an instance of Axios
const api = axios.create({
  baseURL: "https://admin2-pt6zosxz.b4a.run", // https://backendpsl.up.railway.app/
});

export default api;
