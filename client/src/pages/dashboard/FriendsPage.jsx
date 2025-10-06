// src/pages/dashboard/FriendsPage.jsx
import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";

const BACKEND = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function FriendsPage() {
  const { user: authUser, mongoUser, refreshMongoUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // userId currently acting on
  const myId = mongoUser?._id ?? mongoUser?.uid ?? null;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BACKEND}/users`);
        const all = await res.json();
        // server returns array in /users; keep only public fields
        setUsers(Array.isArray(all) ? all : []);
      } catch (err) {
        console.error("Failed to load users", err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const follow = async (targetId) => {
    if (!myId) return alert("No current user id found. Ensure you're logged in.");
    try {
      setActionLoading(targetId);
      const res = await fetch(`${BACKEND}/users/${targetId}/follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentUserId: myId }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed");
      // refresh current user state
      await refreshMongoUser();
      alert(json.message || "Followed");
    } catch (err) {
      console.error(err);
      alert("Follow failed");
    } finally {
      setActionLoading(null);
    }
  };

  const unfollow = async (targetId) => {
    if (!myId) return alert("No current user id found. Ensure you're logged in.");
    try {
      setActionLoading(targetId);
      const res = await fetch(`${BACKEND}/users/${targetId}/unfollow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentUserId: myId }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed");
      await refreshMongoUser();
      alert(json.message || "Unfollowed");
    } catch (err) {
      console.error(err);
      alert("Unfollow failed");
    } finally {
      setActionLoading(null);
    }
  };

  const isFollowing = (targetUser) => {
    if (!mongoUser) return false;
    const following = mongoUser.following || [];
    // server stores following as array of userIds (strings)
    return following.includes(String(targetUser._id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-indigo-700 my-24">Community / People</h2>
    </div>
  );
}
