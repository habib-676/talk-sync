// src/pages/profile/ProfilePage.jsx
<<<<<<< Updated upstream
import React, { useEffect, useState } from "react";
=======
import React, { useEffect, useState, useMemo } from "react";
>>>>>>> Stashed changes
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router";
import { Clock, User, Sparkles, BadgeCheck, Search, X } from "lucide-react";

<<<<<<< Updated upstream
/**
 * ProfilePage - fetches user from backend:
 *  - GET /users/:email  (backend should return { success: true, user })
 *  - Uses VITE_BACKEND_URL or VITE_API_URL (if set)
 */

const BACKEND = import.meta.env.VITE_API_URL || "http://localhost:5000";
async function fetchJson(url, opts = {}) {
  const res = await fetch(url, opts);
  const text = await res.text();
  const ct = res.headers.get("content-type") || "";
  if (!res.ok)
    throw new Error(
      `HTTP ${res.status} ${res.statusText} - ${text.slice(0, 1000)}`
    );
  if (!ct.includes("application/json")) {
    throw new Error(
      `Non-JSON response (content-type: ${ct}). Preview: ${text.slice(0, 500)}`
    );
  }
  return JSON.parse(text);
}

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const email = (
          authUser?.email ||
          localStorage.getItem("demoEmail") ||
          ""
        )
          .toLowerCase()
          .trim();
        if (!email)
          throw new Error(
            "No email available. Sign in or set demoEmail in localStorage."
          );

        const url = `${BACKEND.replace(/\/$/, "")}/users/${encodeURIComponent(
          email
        )}`;
        console.log("Profile fetch URL:", url);
        const data = await fetchJson(url, { method: "GET", signal: ac.signal });
        if (!data?.success)
          throw new Error("Backend returned missing success:true");
        setUser(data.user);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Profile fetch error:", err);
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, [authUser]);

  if (loading)
    return (
      <div className="min-h-screen grid place-items-center">Loading...</div>
    );
  if (error)
    return (
      <div className="min-h-screen grid place-items-center">
        <pre>{error}</pre>
      </div>
    );
  if (!user)
    return (
      <div className="min-h-screen grid place-items-center">
        No profile. Sign in.
      </div>
    );

  // Derived UI values
  const initials = (user.name || user.displayName || user.email || "U")
=======
const BACKEND =
  import.meta.env.VITE_API_URL || "${import.meta.env.VITE_API_URL}";

async function fetchJson(url, opts = {}) {
  const res = await fetch(url, opts);
  const text = await res.text();
  const ct = res.headers.get("content-type") || "";
  if (!res.ok)
    throw new Error(
      `HTTP ${res.status} ${res.statusText} - ${text.slice(0, 500)}`
    );
  if (!ct.includes("application/json"))
    throw new Error(
      `Non-JSON response (content-type: ${ct}). Preview: ${text.slice(0, 300)}`
    );
  return JSON.parse(text);
}

function FriendCard({ f }) {
  const initials = (f?.name || f?.email || "U")
>>>>>>> Stashed changes
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
<<<<<<< Updated upstream
  const avatarSrc = user.image || user.photoURL || null;
=======
  return (
    <Link
      to={`/dashboard/profile?u=${encodeURIComponent(f.email)}`}
      className="block"
    >
      <div className="bg-white/95 p-4 rounded-2xl shadow-lg transform transition hover:-translate-y-2 hover:shadow-2xl cursor-pointer">
        <div className="flex items-start gap-3">
          <div className="w-14 h-14 rounded-full grid place-items-center text-xl font-bold bg-gradient-to-tr from-indigo-100 to-pink-100 text-indigo-700 overflow-hidden">
            {f.image ? (
              <img
                src={f.image}
                alt={f.name}
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-800">
                  {f.name || "Unnamed"}
                </div>
                <div className="text-xs text-gray-500">
                  {f.native_language ? `${f.native_language} • ` : ""}
                  {f.email}
                </div>
              </div>
              <div className="text-xs text-amber-500 font-semibold">
                {(f.badges?.length || 0) > 0 ? `${f.badges.length}★` : ""}
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-600 line-clamp-3">
              {f.bio || "No bio yet."}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [friendsPreview, setFriendsPreview] = useState([]); // up to 3 friends
  const [allFriends, setAllFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [error, setError] = useState(null);
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [friendsQuery, setFriendsQuery] = useState("");

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const email = (
          authUser?.email ||
          localStorage.getItem("demoEmail") ||
          ""
        )
          .toLowerCase()
          .trim();
        if (!email)
          throw new Error(
            "No email available. Sign in or set demoEmail in localStorage."
          );
        const url = `${BACKEND.replace(/\/$/, "")}/users/${encodeURIComponent(
          email
        )}`;
        const data = await fetchJson(url, { signal: ac.signal });
        if (!data?.success)
          throw new Error("Backend returned unexpected payload.");
        setUser(data.user);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, [authUser]);

  // preview: load up to 3 friend profiles
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!user?.friends?.length) {
        setFriendsPreview([]);
        return;
      }
      const ids = user.friends.slice(0, 3);
      try {
        const results = await Promise.all(
          ids.map(async (id) => {
            try {
              const res = await fetch(
                `${BACKEND.replace(/\/$/, "")}/users/id/${encodeURIComponent(
                  id
                )}`
              );
              const json = await res.json();
              return json?.user ?? null;
            } catch (e) {
              console.warn("friend load err", id, e);
              return null;
            }
          })
        );
        if (mounted) setFriendsPreview(results.filter(Boolean));
      } catch (e) {
        console.error("preview friends error", e);
        if (mounted) setFriendsPreview([]);
      }
    })();
    return () => (mounted = false);
  }, [user]);

  // load ALL friends when modal opens
  useEffect(() => {
    if (!showFriendsModal) return;
    let mounted = true;
    (async () => {
      setLoadingFriends(true);
      try {
        if (!user?.friends?.length) {
          setAllFriends([]);
          return;
        }
        const ids = user.friends;
        const results = await Promise.all(
          ids.map(async (id) => {
            try {
              const res = await fetch(
                `${BACKEND.replace(/\/$/, "")}/users/id/${encodeURIComponent(
                  id
                )}`
              );
              const json = await res.json();
              return json?.user ?? null;
            } catch (e) {
              console.warn("friend load err", id, e);
              return null;
            }
          })
        );
        if (mounted) setAllFriends(results.filter(Boolean));
      } catch (e) {
        console.error("all friends load error", e);
        if (mounted) setAllFriends([]);
      } finally {
        if (mounted) setLoadingFriends(false);
      }
    })();
    return () => (mounted = false);
  }, [showFriendsModal, user]);

  const filteredFriends = useMemo(() => {
    if (!friendsQuery.trim()) return allFriends;
    const q = friendsQuery.toLowerCase();
    return allFriends.filter((f) =>
      (f.name || f.email || "").toLowerCase().includes(q)
    );
  }, [allFriends, friendsQuery]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6">
        <div className="animate-pulse text-gray-600 font-medium">
          Loading profile…
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen grid place-items-center p-6 
      bg-gradient-to-br 
      from-indigo-50 via-white to-pink-50">
        <div className="max-w-2xl w-full bg-white/90 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-red-600">
            Unable to load profile
          </h3>
          <pre className="mt-2 text-xs text-gray-700 whitespace-pre-wrap">
            {error}
          </pre>
        </div>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6">
        <div className="text-gray-600">No user found.</div>
      </div>
    );
  }

  const initials = (user.name || user.email || "U")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");
  const avatar = user.image || user.photoURL || null;
>>>>>>> Stashed changes
  const points = Number(user.points ?? 0);
  const progressPct = Math.min(100, Math.round((points / 200) * 100));

  return (
<<<<<<< Updated upstream
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-100 via-white to-pink-100 mt-16">
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <header className="mb-8 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-indigo-600 to-pink-500 shadow-xl">
              <div className="w-full h-full rounded-full bg-white grid place-items-center text-3xl font-extrabold text-indigo-700 overflow-hidden">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={user.name || user.email}
=======
    <div className="min-h-screen pb-12 relative bg-gradient-to-br from-indigo-100 via-white to-pink-100">
      <div className="absolute -right-24 -top-16 w-80 h-80 rounded-full bg-gradient-to-tr from-indigo-300 to-pink-300 opacity-30 blur-3xl transform rotate-12" />
      <div className="absolute -left-28 -bottom-20 w-72 h-72 rounded-full bg-gradient-to-tr from-emerald-200 to-cyan-200 opacity-25 blur-2xl" />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <header className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8">
          <div className="flex items-center gap-5">
            <div className="relative w-36 h-36 rounded-full p-1 bg-gradient-to-tr from-indigo-600 to-pink-500 shadow-2xl">
              <div className="w-full h-full rounded-full bg-white grid place-items-center overflow-hidden text-3xl font-extrabold text-indigo-700">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={user.name}
>>>>>>> Stashed changes
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
<<<<<<< Updated upstream
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-slate-800">
                {user.name || user.displayName || "Unnamed"}
              </h1>
              <p className="text-sm text-slate-500 mt-1">{user.email}</p>
              <div className="mt-3">
                <Link
                  to="/dashboard/profile/edit"
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white text-sm"
                >
                  Edit
=======
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full px-2 py-1 text-xs font-semibold shadow-sm text-indigo-700">
                {user.role || "learner"}
              </div>
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">
                {user.name || "Unnamed"}
              </h1>
              <p className="text-sm text-slate-500 mt-1">{user.email}</p>

              <div className="mt-4 flex items-center gap-3">
                <Link
                  to="/dashboard/profile/edit"
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold shadow hover:brightness-105 transition"
                >
                  Edit profile
>>>>>>> Stashed changes
                </Link>
                <Link
                  to="/schedule"
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-white font-semibold shadow hover:scale-105 transition"
                >
                  Learn now →
                </Link>
                {/* removed top View all friends button per your request */}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
<<<<<<< Updated upstream
            <div className="bg-white/80 px-4 py-3 rounded-2xl shadow-sm text-center">
              <div className="text-xs text-slate-500">Points</div>
              <div className="text-xl font-bold text-indigo-600">{points}</div>
=======
            <div className="bg-white/90 px-5 py-3 rounded-2xl shadow-md text-center">
              <div className="text-xs text-slate-500">Points</div>
              <div className="text-2xl font-bold text-indigo-700">{points}</div>
>>>>>>> Stashed changes
            </div>

            <div className="flex flex-col items-center">
              <div
<<<<<<< Updated upstream
                className="w-20 h-20 rounded-full grid place-items-center shadow-inner"
=======
                className="w-24 h-24 rounded-full grid place-items-center shadow-inner"
>>>>>>> Stashed changes
                style={{
                  background: `conic-gradient(#7C3AED ${
                    progressPct * 3.6
                  }deg, rgba(0,0,0,0.06) ${progressPct * 3.6}deg)`,
                }}
              >
                <div className="w-14 h-14 rounded-full bg-white grid place-items-center text-sm font-semibold">
                  {progressPct}%
                </div>
              </div>
              <div className="text-xs text-slate-500 mt-2">Progress</div>
            </div>
          </div>
        </header>

<<<<<<< Updated upstream
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-lg font-semibold text-indigo-600 mb-3">
                About
              </h2>
              <p className="text-slate-700">{user.bio || "No bio yet."}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-sm text-indigo-600 font-semibold">
                Languages
              </h3>
              <div className="mt-3 flex flex-wrap gap-3">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm">
                  Native: {user.native_language || user.native || "Not set"}
                </span>
                {(user.learning_language && user.learning_language.length
                  ? user.learning_language
                  : ["Not set"]
                ).map((l) => (
                  <span
                    key={l}
                    className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm"
                  >
                    {l}
                  </span>
                ))}
=======
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-lg transform hover:-translate-y-1 transition">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-lg">
                <Clock />
              </div>
              <div>
                <div className="text-xs opacity-90">Sessions this week</div>
                <div className="text-lg font-semibold">
                  {user.sessionsThisWeek ?? 0}
                </div>
>>>>>>> Stashed changes
              </div>
            </div>
          </div>

<<<<<<< Updated upstream
          <aside className="space-y-6">
            <div className="bg-white rounded-2xl p-4 shadow-md">
              <h4 className="text-sm text-indigo-600 font-semibold">
                Quick Actions
              </h4>
              <div className="mt-3 flex flex-col gap-3">
                <Link
                  to="/follow"
                  className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm text-center"
                >
                  Find a partner
                </Link>
                <Link
                  to="/schedule"
                  className="px-3 bg-accent py-2 rounded-lg border text-sm text-white text-center"
                >
                  Learn Now →
                </Link>
                <Link
                  to="/badges"
                  className="px-3 py-2 rounded-lg bg-yellow-300 text-sm text-center"
                >
                  Badges
                </Link>
              </div>
            </div>
=======
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-white shadow-lg transform hover:-translate-y-1 transition">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-lg">
                <User />
              </div>
              <div>
                <div className="text-xs opacity-90">Followers</div>
                <div className="text-lg font-semibold">
                  {user.followers?.length || 0}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-yellow-300 to-orange-400 text-white shadow-lg transform hover:-translate-y-1 transition">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-lg">
                <Sparkles />
              </div>
              <div>
                <div className="text-xs opacity-90">Badges</div>
                <div className="text-lg font-semibold">
                  {user.badges?.length || 0}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Friends preview */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Friends</h3>
            <div className="text-sm text-gray-500">
              {user.friends?.length || 0} friends
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {friendsPreview.length ? (
              friendsPreview.map((f) => (
                <FriendCard key={f._id || f.email} f={f} />
              ))
            ) : (
              <div className="text-gray-500 p-4">You have no friends yet.</div>
            )}
          </div>

          {user.friends?.length > 3 && (
            <div className="mt-4">
              <button
                onClick={() => setShowFriendsModal(true)}
                className="px-4 py-2 rounded-full bg-white border text-indigo-700 shadow hover:shadow-md transition"
              >
                View all friends
              </button>
            </div>
          )}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow">
            <h4 className="text-lg font-semibold text-indigo-600 mb-3">
              About & Onboarding details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500">Native language</div>
                <div className="font-medium">
                  {user.native_language || user.native || "Not set"}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Learning</div>
                <div className="font-medium">
                  {Array.isArray(user.learning_language)
                    ? user.learning_language.join(", ") || "Not set"
                    : user.learning_language || "Not set"}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Proficiency</div>
                <div className="font-medium">
                  {user.proficiency_level || "Not set"}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Interests</div>
                <div className="font-medium">
                  {user.interests && user.interests.length
                    ? user.interests.join(", ")
                    : "Not set"}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Country</div>
                <div className="font-medium">
                  {user.user_country || "Not set"}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">DOB</div>
                <div className="font-medium">
                  {user.date_of_birth || "Not set"}
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow">
              <h4 className="text-sm font-semibold text-indigo-600 flex items-center gap-2">
                Badges <BadgeCheck className="text-amber-400" />
              </h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {user.badges && user.badges.length ? (
                  user.badges.map((b, i) => (
                    <div
                      key={i}
                      className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-200 to-orange-300 text-xs font-semibold text-amber-800 shadow-sm"
                    >
                      {b}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">No badges yet</div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow">
              <h4 className="text-sm font-semibold text-indigo-600">
                Quick stats
              </h4>
              <div className="mt-3 text-sm text-gray-700 space-y-2">
                <div>
                  Friends:{" "}
                  <span className="font-medium">
                    {user.friends?.length || 0}
                  </span>
                </div>
                <div>
                  Followers:{" "}
                  <span className="font-medium">
                    {user.followers?.length || 0}
                  </span>
                </div>
                <div>
                  Sessions this week:{" "}
                  <span className="font-medium">
                    {user.sessionsThisWeek ?? 0}
                  </span>
                </div>
              </div>
            </div>
>>>>>>> Stashed changes
          </aside>
        </section>
      </main>

      {/* FRIENDS MODAL */}
      {showFriendsModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowFriendsModal(false)}
          />
          <div
            className="relative z-60 w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-6 overflow-auto"
            style={{ maxHeight: "85vh" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">All Friends</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-100 rounded-full px-3 py-1">
                  <Search className="text-slate-500 mr-2" />
                  <input
                    value={friendsQuery}
                    onChange={(e) => setFriendsQuery(e.target.value)}
                    placeholder="Search friends"
                    className="bg-transparent outline-none text-sm"
                  />
                </div>
                <button
                  onClick={() => setShowFriendsModal(false)}
                  className="p-2 rounded-full hover:bg-slate-100"
                >
                  <X />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {loadingFriends ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse h-28 bg-slate-100 rounded-2xl"
                  />
                ))
              ) : filteredFriends.length ? (
                filteredFriends.map((f) => (
                  <FriendCard key={f._id || f.email} f={f} />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 p-8">
                  No friends found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
