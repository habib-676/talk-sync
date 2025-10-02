import axios from "axios";

export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export const setUserInDb = async (user) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URL}/users`,
    user
  );
  console.log(data);
  // return data;
};

//get a specific user data
export const getUserByEmail = async (email) => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/users/${email}`
  );
  return data.user;
};
