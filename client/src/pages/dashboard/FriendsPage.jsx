// src/pages/dashboard/FriendsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import useAuth from "../../hooks/useAuth";

const BACKEND =
  import.meta.env.VITE_API_URL || "${import.meta.env.VITE_API_URL}";

export default function FriendsPage() {
  const { mongoUser, loadingMongo, refreshMongoUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // id being followed/unfollowed
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token") || null;

  // Build common headers (include token later when you add verifyToken)
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // fetch users list
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingUsers(true);
        setError(null);
        const res = await fetch(`${BACKEND}/users`, { headers });
        if (!res.ok) throw new Error(`Failed to load users (${res.status})`);
        const data = await res.json();
        if (mounted) setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading users:", err);
        if (mounted) setError(err.message || "Failed to load users");
      } finally {
        if (mounted) setLoadingUsers(false);
      }
    })();
    return () => (mounted = false);
  }, []); // run once

  // helper: derive myId and following set
  const myId = useMemo(() => {
    // prefer Mongo _id; fallback to uid or email
    if (!mongoUser) return null;
    if (mongoUser._id) return String(mongoUser._id);
    if (mongoUser.uid) return String(mongoUser.uid);
    return mongoUser.email ? String(mongoUser.email) : null;
  }, [mongoUser]);

  const followingSet = useMemo(() => {
    if (!mongoUser) return new Set();
    const arr = mongoUser.following || [];
    return new Set(arr.map(String));
  }, [mongoUser]);

  // split users into following and suggested
  const { followingList, suggestedList } = useMemo(() => {
    const followingList = [];
    const suggestedList = [];
    users.forEach((u) => {
      const id = String(u._id || u.uid || u.email);
      const isSelf = myId && id === myId;
      if (isSelf) return; // skip yourself
      if (followingSet.has(id)) followingList.push(u);
      else suggestedList.push(u);
    });
    return { followingList, suggestedList };
  }, [users, myId, followingSet]);

  // follow API call
  const follow = async (targetUser) => {
    if (!myId) return alert("Please sign in to follow users.");
    const targetId = String(
      targetUser._id || targetUser.uid || targetUser.email
    );
    setActionLoading(targetId);
    try {
      const res = await fetch(
        `${BACKEND}/users/${encodeURIComponent(targetId)}/follow`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ currentUserId: myId }),
        }
      );
      const json = await res.json();
      if (!res.ok)
        throw new Error(json?.message || `Follow failed (${res.status})`);
      // refresh local state
      await refreshMongoUser();
      // refresh whole list to reflect any changes (optional but useful)
      const r2 = await fetch(`${BACKEND}/users`, { headers });
      if (r2.ok) {
        const d = await r2.json();
        setUsers(Array.isArray(d) ? d : []);
      }
    } catch (err) {
      console.error("Follow error:", err);
      alert(err.message || "Failed to follow user");
    } finally {
      setActionLoading(null);
    }
  };

  // unfollow API call
  const unfollow = async (targetUser) => {
    if (!myId) return alert("Please sign in to unfollow users.");
    const targetId = String(
      targetUser._id || targetUser.uid || targetUser.email
    );
    setActionLoading(targetId);
    try {
      const res = await fetch(
        `${BACKEND}/users/${encodeURIComponent(targetId)}/unfollow`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ currentUserId: myId }),
        }
      );
      const json = await res.json();
      if (!res.ok)
        throw new Error(json?.message || `Unfollow failed (${res.status})`);
      await refreshMongoUser();
      const r2 = await fetch(`${BACKEND}/users`, { headers });
      if (r2.ok) {
        const d = await r2.json();
        setUsers(Array.isArray(d) ? d : []);
      }
    } catch (err) {
      console.error("Unfollow error:", err);
      alert(err.message || "Failed to unfollow user");
    } finally {
      setActionLoading(null);
    }
  };

  if (loadingUsers || loadingMongo) {
    return (
      <div className="text-center text-gray-500 py-8">Loading people…</div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded p-4 shadow">
        <h3 className="text-red-600 font-semibold">Error</h3>
        <div className="text-sm text-gray-600 mt-2">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-indigo-700">People & Friends</h2>

      {/* Following section */}
      <section className="bg-white rounded-2xl p-4 shadow">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-700">
            Following ({followingList.length})
          </h3>
          <p className="text-xs text-slate-400">People you follow</p>
        </div>

        {followingList.length === 0 ? (
          <div className="text-sm text-gray-500 py-6 text-center">
            You are not following anyone yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {followingList.map((u) => {
              const id = String(u._id || u.uid || u.email);
              return (
                <div
                  key={id}
                  className="flex items-center gap-4 p-3 rounded-lg border"
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-50 grid place-items-center overflow-hidden text-indigo-700 font-bold">
                    {u.image ? (
                      <img
                        className="w-full h-full object-cover"
                        src={u.image}
                        alt={u.name || u.email}
                      />
                    ) : (
                      (u.name || u.email || "U").slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-800 truncate">
                      {u.name || "Unnamed"}
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      {u.native_language || u.native || "—"}
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => unfollow(u)}
                      disabled={actionLoading === id}
                      className="px-3 py-1 rounded-full border text-sm text-slate-700 hover:bg-slate-50"
                    >
                      {actionLoading === id ? "..." : "Unfollow"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Suggested section */}
      <section className="bg-white rounded-2xl p-4 shadow">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-700">
            People you may follow ({suggestedList.length})
          </h3>
          <p className="text-xs text-slate-400">
            Suggested based on language & activity
          </p>
        </div>

        {suggestedList.length === 0 ? (
          <div className="text-sm text-gray-500 py-6 text-center">
            No suggestions right now — great! 👏
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {suggestedList.map((u) => {
              const id = String(u._id || u.uid || u.email);
              return (
                <div
                  key={id}
                  className="p-3 rounded-lg border flex flex-col gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 grid place-items-center overflow-hidden text-indigo-700 font-bold">
                      {u.image ? (
                        <img
                          className="w-full h-full object-cover"
                          src={u.image}
                          alt={u.name || u.email}
                        />
                      ) : (
                        (u.name || u.email || "U").slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-800 truncate">
                        {u.name || "Unnamed"}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {u.native_language || u.native || "—"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                      {u.points ?? 0} pts
                    </div>
                    <div>
                      <button
                        onClick={() => follow(u)}
                        disabled={actionLoading === id}
                        className="px-3 py-1 rounded-full bg-indigo-600 text-white text-sm hover:brightness-105"
                      >
                        {actionLoading === id ? "..." : "Follow"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
