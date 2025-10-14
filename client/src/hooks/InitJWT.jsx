import { useEffect } from "react";
import axios from "axios";
import useAuth from "./useAuth";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true, 
});

export default function InitJWT() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user?.email) return;
    (async () => {
      try {
        await api.post("/jwt", { email: user.email }); 
      } catch (e) {
        console.error("JWT init failed:", e);
      }
    })();
  }, [user?.email, loading]);

  return null; 
}
