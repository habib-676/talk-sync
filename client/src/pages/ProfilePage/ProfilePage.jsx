import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router";

/**
 * ProfilePage (robust)
 * - First tries same-origin /api/me (uses token if present)
 * - If response is non-JSON (HTML), retries against BACKEND_ORIGIN (default http://localhost:5000)
 * - If still failing, tries backend /api/me?email=... fallback
 * - Shows helpful diagnostic message in UI
 */

const BACKEND_ORIGIN = (import.meta.env && import.meta.env.VITE_BACKEND_ORIGIN) || "http://localhost:5000";

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(authUser || null);
  const [loading, setLoading] = useState(!authUser);
  const [error, setError] = useState(null);

  // helper: fetch and return parsed JSON or throw with helpful info
  async function safeFetchJson(url, opts = {}) {
    const res = await fetch(url, opts);
    const ct = res.headers.get("content-type") || "";
    const text = await res.text();

    if (!res.ok) {
      const msg = `HTTP ${res.status} ${res.statusText} - ${text.slice(0, 1000)}`;
      const err = new Error(msg);
      err.status = res.status;
      err.body = text;
      throw err;
    }

    if (ct.includes("application/json")) {
      try {
        return JSON.parse(text);
      } catch (e) {
        const err = new Error("Failed to parse JSON response");
        err.body = text;
        throw err;
      }
    }

    // Not JSON (likely HTML or text)
    const err = new Error("Server returned non-JSON response");
    err.body = text;
    err.contentType = ct;
    throw err;
  }

  // Build headers (include token if present in localStorage)
  function buildHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  useEffect(() => {
    // If authUser already contains server profile fields, use it
    if (authUser && authUser.native) {
      setUser(authUser);
      setLoading(false);
      return;
    }

    let mounted = true;
    const ac = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const headers = buildHeaders();

        // 1) Try same-origin /api/me first
        try {
          const json = await safeFetchJson("/api/me", { method: "GET", headers, signal: ac.signal });
          if (mounted) setUser(json);
          return;
        } catch (firstErr) {
          console.warn("Primary /api/me failed:", firstErr.message);

          // If the body looks like HTML (index.html from frontend dev server), note it
          const bodyPreview = firstErr.body ? String(firstErr.body).slice(0, 200) : "";

          // 2) If primary failed due to non-JSON (prob dev-proxy), try backend origin directly
          let backendAttemptError = null;
          try {
            const backendUrl = `${BACKEND_ORIGIN.replace(/\/$/, "")}/api/me`;
            const json2 = await safeFetchJson(backendUrl, { method: "GET", headers, signal: ac.signal });
            if (mounted) setUser(json2);
            return;
          } catch (backendErr) {
            backendAttemptError = backendErr;
            console.warn(`Backend ${BACKEND_ORIGIN}/api/me attempt failed:`, backendErr.message);
          }

          // 3) If backend origin also failed, try fallback using email (from authUser or demoEmail)
          const emailFromAuth = authUser?.email;
          const demoEmail = localStorage.getItem("demoEmail");
          const fallbackEmail = emailFromAuth || demoEmail;

          if (!fallbackEmail) {
            // No email to try - return a diagnostic error including the primary and backend attempts
            const p = firstErr.message || "primary failed";
            const b = backendAttemptError ? backendAttemptError.message : "backend attempt not made";
            throw new Error(`Primary /api/me error: ${p}\nBackend ${BACKEND_ORIGIN}/api/me error: ${b}\nBody preview (primary): ${bodyPreview}\nNo fallback email found. Set localStorage 'demoEmail' or fix proxy/backend.`);
          }

          // 4) Try backend fallback with ?email=...
          try {
            const fallbackUrl = `${BACKEND_ORIGIN.replace(/\/$/, "")}/api/me?email=${encodeURIComponent(fallbackEmail)}`;
            const json3 = await safeFetchJson(fallbackUrl, { method: "GET", headers, signal: ac.signal });
            if (mounted) setUser(json3);
            return;
          } catch (fallbackErr) {
            const msg = [
              `Primary /api/me error: ${firstErr.message}`,
              `Backend ${BACKEND_ORIGIN}/api/me error: ${backendAttemptError ? backendAttemptError.message : "no attempt info"}`,
              `Fallback ${fallbackEmail} error: ${fallbackErr.message}`,
            ].join("\n\n");
            throw new Error(msg);
          }
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Failed to load profile:", err);
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      ac.abort();
    };
  }, [authUser]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        <div className="text-gray-500 animate-pulse">Loading profile…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6">
        <div className="max-w-2xl text-center">
          <p className="text-lg text-red-600">Error loading profile</p>
          <pre className="text-sm text-gray-700 bg-white/80 p-3 rounded mt-3 text-left overflow-auto" style={{ whiteSpace: "pre-wrap" }}>
            {error}
          </pre>
          <p className="text-sm text-gray-600 mt-3">
            Tips:
            <ul className="list-disc list-inside text-left mt-2">
              <li>Ensure your backend at <code>{BACKEND_ORIGIN}</code> is running and `/api/me` returns JSON.</li>
              <li>For dev only: set a demo email: <code>localStorage.setItem('demoEmail','your@example.com')</code>.</li>
              <li>Better long-term: add a dev proxy in Vite/CRA so requests to <code>/api</code> go to the backend.</li>
            </ul>
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        <div className="text-center">
          <p className="text-lg">No profile found. Please sign in.</p>
        </div>
      </div>
    );
  }

  // derived values
  const initials = (user.name || user.displayName || user.email || "U")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  const points = Number(user.points ?? 85);
  const progressPct = Math.min(100, Math.round((points / 200) * 100)); // example scale
  const donutStyle = { background: `conic-gradient(#7C3AED ${progressPct * 3.6}deg, rgba(0,0,0,0.06) ${progressPct * 3.6}deg)` };
  const avatarSrc = user.image || user.photoURL || null;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-100 via-white to-pink-100 mt-16">
      {/* Decorative floating blobs */}
      <div className="pointer-events-none absolute -right-20 -top-28 w-80 h-80 rounded-full bg-gradient-to-tr from-indigo-300 to-pink-300 opacity-30 blur-3xl transform rotate-45"></div>
      <div className="pointer-events-none absolute -left-28 -bottom-20 w-72 h-72 rounded-full bg-gradient-to-tr from-emerald-200 to-cyan-200 opacity-25 blur-2xl"></div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <header className="mb-8 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-36 h-36 rounded-full p-1 bg-gradient-to-tr from-indigo-600 to-pink-500 shadow-xl transform transition-transform hover:scale-105" aria-hidden>
              <div className="w-full h-full rounded-full bg-white grid place-items-center text-4xl font-extrabold text-indigo-700 overflow-hidden">
                {avatarSrc ? <img src={avatarSrc} alt={user.name || user.email || "User avatar"} className="w-full h-full object-cover" /> : initials}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full px-2 py-1 text-xs font-semibold shadow-sm text-indigo-700">{user.badges?.[0] ?? "New"}</div>
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">{user.name || user.displayName || "Unnamed"}</h1>
              <p className="text-sm text-slate-500 mt-1">{user.email}</p>
              <div className="mt-3 flex items-center gap-3">
                <span className="text-xs text-slate-600 bg-white/60 px-3 py-1 rounded-full shadow-sm">Available: {user.availability || "Not set"}</span>
                <Link to="/profile/edit" className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white text-sm shadow hover:brightness-105 transition" aria-label="Edit profile">Edit Profile</Link>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="bg-white/80 backdrop-blur-md px-4 py-3 rounded-2xl shadow-sm text-center">
              <div className="text-xs text-slate-500">Sessions this week</div>
              <div className="text-xl font-bold text-indigo-600">{user.sessionsThisWeek ?? 5}</div>
            </div>

            <div className="bg-white/80 backdrop-blur-md px-4 py-3 rounded-2xl shadow-sm text-center">
              <div className="text-xs text-slate-500">Points</div>
              <div className="text-xl font-bold text-pink-600">{points}</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full grid place-items-center shadow-inner" style={donutStyle} aria-hidden>
                <div className="w-12 h-12 rounded-full bg-white grid place-items-center text-sm font-semibold">{progressPct}%</div>
              </div>
              <div className="text-xs text-slate-500 mt-2">Progress</div>
              <div role="progressbar" aria-valuenow={progressPct} aria-valuemin="0" aria-valuemax="100" className="sr-only">{progressPct}% complete</div>
            </div>
          </div>
        </header>

        {/* main content columns */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
              <h2 className="text-lg font-semibold text-indigo-600 mb-3">About</h2>
              <p className="text-slate-700 leading-relaxed">{user.bio || "You haven't added a bio yet — tell people what you are learning and why!"}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h3 className="text-sm text-indigo-600 font-semibold">Languages</h3>
                <div className="mt-3 flex flex-wrap gap-3">
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 text-sm">Native: {user.native || "Not specified"}</span>
                  {(user.learning && user.learning.length ? user.learning : ["Not specified"]).map((l) => (
                    <span key={l} className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-50 to-pink-50 text-indigo-700 text-sm shadow-sm">{l}</span>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-64">
                <h3 className="text-sm text-indigo-600 font-semibold">Availability</h3>
                <div className="mt-2 text-slate-700">{user.availability || "Not set"}</div>

                <div className="mt-4">
                  <h4 className="text-xs text-slate-400">Profile completion</h4>
                  <div className="mt-2 w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="h-3 rounded-full" style={{ width: `${progressPct}%`, background: "linear-gradient(90deg,#7C3AED,#EC4899)" }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-indigo-600">Recent Sessions</h3>
                <Link to="/sessions" className="text-sm text-indigo-500">View all</Link>
              </div>

              <ul className="mt-4 space-y-3">
                {(user.recent && user.recent.length ? user.recent : [
                  { id: 1, title: "English: Travel", partner: "Liam", time: "2h ago", rating: 5 },
                  { id: 2, title: "Spanish: Basics", partner: "Marta", time: "1d ago", rating: 4 },
                ]).map((r) => (
                  <li key={r.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition">
                    <div>
                      <div className="font-medium text-slate-800">{r.title}</div>
                      <div className="text-xs text-slate-400">{r.partner} • {r.time}</div>
                    </div>
                    <div className="text-yellow-500 text-sm">{"★".repeat(r.rating)}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition">
              <h4 className="text-sm text-indigo-600 font-semibold">Quick Actions</h4>
              <div className="mt-3 flex flex-col gap-3">
                <Link to="/follow" className="px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-500 text-white text-sm text-center hover:brightness-105 transition">Find a partner</Link>
                <Link to="/schedule" className="px-3 py-2 rounded-lg border text-sm text-slate-700 text-center hover:shadow-sm transition">Schedule a session</Link>
                <Link to="/badges" className="px-3 py-2 rounded-lg bg-gradient-to-r from-yellow-300 to-orange-400 text-sm text-center hover:brightness-105 transition">View badges</Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition">
              <h4 className="text-sm text-indigo-600 font-semibold">Community</h4>
              <div className="mt-3 text-slate-700 text-sm">
                <div>{(user.stats?.learners ?? 5000).toLocaleString()}+ learners</div>
                <div className="text-xs text-slate-400">{user.stats?.countries ?? 80} countries • {user.stats?.languages ?? 20} languages</div>
              </div>

              <div className="mt-4">
                <div className="text-xs text-slate-400">Recent achievements</div>
                <div className="mt-2 flex gap-2">
                  <span className="px-2 py-1 rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 text-xs font-semibold">Bronze</span>
                  <span className="px-2 py-1 rounded-full bg-gradient-to-r from-slate-200 to-slate-300 text-xs font-semibold">Silver</span>
                </div>
              </div>
            </div>

            <div className="bg-white/80 text-xs text-slate-500 p-3 rounded-lg text-center shadow-sm">
              Tip: Keep sessions 10+ minutes to count toward progress.
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
