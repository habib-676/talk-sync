import axios from "axios";

const axiosSecure = axios.create({
<<<<<<< HEAD
<<<<<<< Updated upstream
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
=======
  baseURL: import.meta.env.VITE_API_URL,
>>>>>>> Stashed changes
=======
  baseURL: import.meta.env.VITE_API_URL,
>>>>>>> e9ab4032b463353a7abc31fbc945f83783bedff0
  withCredentials: true,
});

export default axiosSecure;
