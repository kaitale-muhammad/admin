import axios from "axios";

// Create an instance of Axios
const api = axios.create({
  baseURL: "http://localhost:3000", // Replace with your base URL
});

export default api;

// <!-- put for me a search bar in the toolbar and when i search the id it searches the id from
// the attendance table from the databsese and returns the date and pass the day in the corresponding chip and make the chip green -->
