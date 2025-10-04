// src/pages/profile/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router";

/**
 * ProfilePage - fetches user from backend:
 *  - GET /users/:email  (backend should return { success: true, user })
 *  - Uses VITE_BACKEND_URL or VITE_API_URL (if set)
 */

const BACKEND =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";
async function fetchJson(url, opts = {}) {
  const res = await fetch(url, opts);
  const text = await res.text();
  const ct = res.headers.get("content-type") || "";
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} - ${text.slice(0,1000)}`);
  if (!ct.includes("application/json")) {
    throw new Error(`Non-JSON response (content-type: ${ct}). Preview: ${text.slice(0,500)}`);
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
        const email = (authUser?.email || localStorage.getItem("demoEmail") || "").toLowerCase().trim();
        if (!email) throw new Error("No email available. Sign in or set demoEmail in localStorage.");

        const url = `${BACKEND.replace(/\/$/, "")}/users/${encodeURIComponent(email)}`;
        console.log("Profile fetch URL:", url);
        const data = await fetchJson(url, { method: "GET", signal: ac.signal });
        if (!data?.success) throw new Error("Backend returned missing success:true");
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

  if (loading) return <div className="min-h-screen grid place-items-center">Loading...</div>;
  if (error) return <div className="min-h-screen grid place-items-center"><pre>{error}</pre></div>;
  if (!user) return <div className="min-h-screen grid place-items-center">No profile. Sign in.</div>;

  // Derived UI values
  const initials = (user.name || user.displayName || user.email || "U")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  const avatarSrc = user.image || user.photoURL || null;
  const points = Number(user.points ?? 0);
  const progressPct = Math.min(100, Math.round((points / 200) * 100));

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-100 via-white to-pink-100 mt-16">
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <header className="mb-8 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-indigo-600 to-pink-500 shadow-xl">
              <div className="w-full h-full rounded-full bg-white grid place-items-center text-3xl font-extrabold text-indigo-700 overflow-hidden">
                {avatarSrc ? <img src={avatarSrc} alt={user.name || user.email} className="w-full h-full object-cover" /> : initials}
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-slate-800">{user.name || user.displayName || "Unnamed"}</h1>
              <p className="text-sm text-slate-500 mt-1">{user.email}</p>
              <div className="mt-3">
                <Link to="/profile/edit" className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white text-sm">Edit</Link>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="bg-white/80 px-4 py-3 rounded-2xl shadow-sm text-center">
              <div className="text-xs text-slate-500">Points</div>
              <div className="text-xl font-bold text-indigo-600">{points}</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full grid place-items-center shadow-inner" style={{ background: `conic-gradient(#7C3AED ${progressPct * 3.6}deg, rgba(0,0,0,0.06) ${progressPct * 3.6}deg)` }}>
                <div className="w-12 h-12 rounded-full bg-white grid place-items-center text-sm font-semibold">{progressPct}%</div>
              </div>
              <div className="text-xs text-slate-500 mt-2">Progress</div>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-lg font-semibold text-indigo-600 mb-3">About</h2>
              <p className="text-slate-700">{user.bio || "No bio yet."}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-sm text-indigo-600 font-semibold">Languages</h3>
              <div className="mt-3 flex flex-wrap gap-3">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm">Native: {user.native_language || user.native || "Not set"}</span>
                {(user.learning_language && user.learning_language.length ? user.learning_language : ["Not set"]).map((l) => (
                  <span key={l} className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm">{l}</span>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white rounded-2xl p-4 shadow-md">
              <h4 className="text-sm text-indigo-600 font-semibold">Quick Actions</h4>
              <div className="mt-3 flex flex-col gap-3">
                <Link to="/follow" className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm text-center">Find a partner</Link>
                <Link to="/schedule" className="px-3 py-2 rounded-lg border text-sm text-slate-700 text-center">Schedule</Link>
                <Link to="/badges" className="px-3 py-2 rounded-lg bg-yellow-300 text-sm text-center">Badges</Link>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
