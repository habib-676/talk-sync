import axiosSecure from "../hooks/useAxiosSecure";

export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export const setUserInDb = async (user) => {
  try {
    const res = await axiosSecure.post("/users", user);

    await axiosSecure.post("/jwt", { email: user.email });

    console.log(" User saved and JWT cookie set", res.data);
  } catch (err) {
    console.error("Error in setUserInDb:", err);
  }
};

//get a specific user data
export const getUserByEmail = async (email) => {
  const { data } = await axiosSecure.get(`/users/${email}`);
  return data.user;
};
