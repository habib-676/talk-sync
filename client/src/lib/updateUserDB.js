import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  //   withCredentials: true,
});

// update user profile
export const updateUserProfile = async (email, data) => {
  try {
    const res = await API.put(`/users/${email}`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error.response?.data || error;
  }
};
