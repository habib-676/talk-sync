import axios from "axios";

const axiosSecure = axios.create({
<<<<<<< Updated upstream
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
=======
  baseURL: import.meta.env.VITE_API_URL,
>>>>>>> Stashed changes
  withCredentials: true,
});

export default axiosSecure;
