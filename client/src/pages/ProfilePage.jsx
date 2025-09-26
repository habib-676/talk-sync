import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router";

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(authUser || null);
  const [loading, setLoading] = useState(!authUser);

  useEffect(() => {
    if (authUser && authUser.native) {
      setUser(authUser);
      setLoading(false);
      return;
    }

    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/me", {
          headers: {
            "Content-Type": "application/json",
            ...(localStorage.getItem("token")
              ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
              : {}),
          },
        });

        if (!res.ok) throw new Error("Failed to load profile");
        const json = await res.json();
        if (mounted) setUser(json);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => (mounted = false);
  }, [authUser]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        <div className="text-gray-500 animate-pulse">Loading profile…</div>
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
  const points = user.points ?? 85;
  const progressPct = Math.min(100, Math.round((points / 200) * 100)); // example scale
  const donutStyle = {
    background: `conic-gradient(#7C3AED ${
      progressPct * 3.6
    }deg, rgba(0,0,0,0.06) ${progressPct * 3.6}deg)`,
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-100 via-white to-pink-100 mt-16">
      {/* Decorative floating blobs */}
      <div className="pointer-events-none absolute -right-20 -top-28 w-80 h-80 rounded-full bg-gradient-to-tr from-indigo-300 to-pink-300 opacity-30 blur-3xl transform rotate-45"></div>
      <div className="pointer-events-none absolute -left-28 -bottom-20 w-72 h-72 rounded-full bg-gradient-to-tr from-emerald-200 to-cyan-200 opacity-25 blur-2xl"></div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <header className="mb-8 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className="relative w-36 h-36 rounded-full p-1 bg-gradient-to-tr from-indigo-600 to-pink-500 shadow-xl transform transition-transform hover:scale-105"
              aria-hidden
            >
              {/* avatar circle */}
              <div className="w-full h-full rounded-full bg-white grid place-items-center text-4xl font-extrabold text-indigo-700 overflow-hidden">
                {user.photoURL ? (
                  // show image if available
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User avatar"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              {/* small badge */}
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full px-2 py-1 text-xs font-semibold shadow-sm text-indigo-700">
                {user.badges?.[0] ?? "New"}
              </div>
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">
                {user.name || user.displayName || "Unnamed"}
              </h1>
              <p className="text-sm text-slate-500 mt-1">{user.email}</p>
              <div className="mt-3 flex items-center gap-3">
                <span className="text-xs text-slate-600 bg-white/60 px-3 py-1 rounded-full shadow-sm">
                  Available: {user.availability || "Not set"}
                </span>
                <Link
                  to="/profile/edit"
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white text-sm shadow hover:brightness-105 transition"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* small stats */}
            <div className="bg-white/80 backdrop-blur-md px-4 py-3 rounded-2xl shadow-sm text-center">
              <div className="text-xs text-slate-500">Sessions this week</div>
              <div className="text-xl font-bold text-indigo-600">
                {" "}
                {user.sessionsThisWeek ?? 5}{" "}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md px-4 py-3 rounded-2xl shadow-sm text-center">
              <div className="text-xs text-slate-500">Points</div>
              <div className="text-xl font-bold text-pink-600">{points}</div>
            </div>

            {/* donut progress */}
            <div className="flex flex-col items-center">
              <div
                className="w-20 h-20 rounded-full grid place-items-center shadow-inner"
                style={donutStyle}
                aria-hidden
              >
                <div className="w-12 h-12 rounded-full bg-white grid place-items-center text-sm font-semibold">
                  {progressPct}%
                </div>
              </div>
              <div className="text-xs text-slate-500 mt-2">Progress</div>
            </div>
          </div>
        </header>

        {/* main content two-column */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* left column: about & languages */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
              <h2 className="text-lg font-semibold text-indigo-600 mb-3">
                About
              </h2>
              <p className="text-slate-700 leading-relaxed">
                {user.bio ||
                  "You haven't added a bio yet — tell people what you are learning and why!"}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h3 className="text-sm text-indigo-600 font-semibold">
                  Languages
                </h3>
                <div className="mt-3 flex flex-wrap gap-3">
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 text-sm">
                    Native: {user.native || "Not specified"}
                  </span>
                  {(user.learning && user.learning.length
                    ? user.learning
                    : ["Not specified"]
                  ).map((l) => (
                    <span
                      key={l}
                      className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-50 to-pink-50 text-indigo-700 text-sm shadow-sm"
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-64">
                <h3 className="text-sm text-indigo-600 font-semibold">
                  Availability
                </h3>
                <div className="mt-2 text-slate-700">
                  {user.availability || "Not set"}
                </div>

                <div className="mt-4">
                  <h4 className="text-xs text-slate-400">Profile completion</h4>
                  <div className="mt-2 w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div
                      className="h-3 rounded-full"
                      style={{
                        width: `${progressPct}%`,
                        background: "linear-gradient(90deg,#7C3AED,#EC4899)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* recent sessions */}
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-indigo-600">
                  Recent Sessions
                </h3>
                <a href="/sessions" className="text-sm text-indigo-500">
                  View all
                </a>
              </div>

              <ul className="mt-4 space-y-3">
                {(user.recent && user.recent.length
                  ? user.recent
                  : [
                      {
                        id: 1,
                        title: "English: Travel",
                        partner: "Liam",
                        time: "2h ago",
                        rating: 5,
                      },
                      {
                        id: 2,
                        title: "Spanish: Basics",
                        partner: "Marta",
                        time: "1d ago",
                        rating: 4,
                      },
                    ]
                ).map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition"
                  >
                    <div>
                      <div className="font-medium text-slate-800">
                        {r.title}
                      </div>
                      <div className="text-xs text-slate-400">
                        {r.partner} • {r.time}
                      </div>
                    </div>
                    <div className="text-yellow-500 text-sm">
                      {"★".repeat(r.rating)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* right column: quick actions & communities */}
          <aside className="space-y-6">
            <div className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition">
              <h4 className="text-sm text-indigo-600 font-semibold">
                Quick Actions
              </h4>
              <div className="mt-3 flex flex-col gap-3">
                
                <Link to='/follow' className="px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-500 text-white text-sm text-center hover:brightness-105 transition">
                Find a partner
                </Link>
                <a href="/schedule" className="px-3 py-2 rounded-lg border text-sm text-slate-700 text-center hover:shadow-sm transition">Schedule a session</a>
                <a href="/badges" className="px-3 py-2 rounded-lg bg-gradient-to-r from-yellow-300 to-orange-400 text-sm text-center hover:brightness-105 transition">View badges</a>
                <a
                  href="/match"
                  className="px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-500 text-white text-sm text-center hover:brightness-105 transition"
                >
                  Find a partner
                </a>
                <a
                  href="/schedule"
                  className="px-3 py-2 rounded-lg border text-sm text-slate-700 text-center hover:shadow-sm transition"
                >
                  Schedule a session
                </a>
                <a
                  href="/badges"
                  className="px-3 py-2 rounded-lg bg-gradient-to-r from-yellow-300 to-orange-400 text-sm text-center hover:brightness-105 transition"
                >
                  View badges
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition">
              <h4 className="text-sm text-indigo-600 font-semibold">
                Community
              </h4>
              <div className="mt-3 text-slate-700 text-sm">
                <div>
                  {(user.stats?.learners ?? 5000).toLocaleString()}+ learners
                </div>
                <div className="text-xs text-slate-400">
                  {user.stats?.countries ?? 80} countries •{" "}
                  {user.stats?.languages ?? 20} languages
                </div>
              </div>

              <div className="mt-4">
                <div className="text-xs text-slate-400">
                  Recent achievements
                </div>
                <div className="mt-2 flex gap-2">
                  <span className="px-2 py-1 rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 text-xs font-semibold">
                    Bronze
                  </span>
                  <span className="px-2 py-1 rounded-full bg-gradient-to-r from-slate-200 to-slate-300 text-xs font-semibold">
                    Silver
                  </span>
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
