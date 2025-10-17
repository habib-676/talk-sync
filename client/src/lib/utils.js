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

// following/followers helpers (server returns { success, users })
export const getFollowingByEmail = async (email) => {
  const { data } = await axiosSecure.get(`/users/following/${email}`);
  return data.users || [];
};

export const getFollowersByEmail = async (email) => {
  const { data } = await axiosSecure.get(`/users/followers/${email}`);
  return data.users || [];
};

// unread utilities
export const getUnreadCounts = async (userId) => {
  const { data } = await axiosSecure.get(`/messages/unread-counts`, {
    params: { userId },
  });
  return data.counts || {};
};

export const markConversationSeen = async (userId, otherUserId) => {
  const { data } = await axiosSecure.post(`/messages/mark-seen`, {
    userId,
    otherUserId,
  });
  return data.modified || 0;
};
