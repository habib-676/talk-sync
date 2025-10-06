// src/pages/dashboard/SessionsPage.jsx
import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";

const BACKEND = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function SessionsPage() {
  const { mongoUser } = useAuth();
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  // schedule form state
  const [language, setLanguage] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [startTime, setStartTime] = useState("");

  useEffect(() => {
    // fetch upcoming sessions for user - if your backend stores sessions
    const fetchSessions = async () => {
      try {
        setLoading(true);
        // If you implement a /sessions endpoint, call it here:
        // const res = await fetch(`${BACKEND}/sessions?email=${encodeURIComponent(mongoUser?.email)}`);
        // const data = await res.json();
        // setUpcoming(data.sessions || []);
        // For now we read from user.recent (if backend fills it)
        if (mongoUser?.recent) {
          setUpcoming(mongoUser.recent.filter(r => r.startTime && new Date(r.startTime) > new Date()));
        } else {
          setUpcoming([]);
        }
      } catch (err) {
        console.error(err);
        setUpcoming([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [mongoUser]);

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!mongoUser?.email) return alert("Please login");
    if (!startTime || !language) return alert("Please fill required fields");

    // Example POST to backend to create a session (you need to implement server side)
    try {
      const payload = {
        creatorEmail: mongoUser.email,
        partnerEmail: partnerEmail || null,
        language,
        startTime,
        createdAt: new Date().toISOString(),
      };
      // placeholder endpoint: POST /sessions (implement in server)
      const res = await fetch(`${BACKEND}/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to schedule");
      alert("Session scheduled (backend must implement /sessions)");
      // Optionally refresh sessions
    } catch (err) {
      console.error(err);
      alert("Schedule failed (server might not have /sessions implemented)");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">Sessions</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded-2xl shadow">
            <h3 className="font-semibold text-indigo-600">Upcoming sessions</h3>
            {loading ? (
              <div className="text-sm text-gray-500 mt-3">Loading…</div>
            ) : upcoming.length ? (
              <ul className="mt-3 space-y-3">
                {upcoming.map((s, idx) => (
                  <li key={s.id ?? idx} className="p-3 rounded-lg border">
                    <div className="font-medium">{s.title || s.language || "Session"}</div>
                    <div className="text-xs text-slate-500">{s.partner || s.partnerEmail || "TBA"} • {new Date(s.startTime).toLocaleString()}</div>
                    <div className="mt-2 text-sm">{s.note}</div>
                    <div className="mt-2">
                      <a href={s.joinUrl || "#"} className="text-indigo-600 text-sm">Join</a>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-gray-500 mt-3">No upcoming sessions.</div>
            )}
          </div>

          <div className="bg-white p-4 rounded-2xl shadow">
            <h3 className="font-semibold text-indigo-600">Session history (recent)</h3>
            <div className="text-sm text-slate-600 mt-2">Past sessions and feedback can appear here (once backend saves sessions).</div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-white p-4 rounded-2xl shadow">
            <h4 className="text-sm text-indigo-600 font-semibold">Schedule a session</h4>
            <form className="mt-3 space-y-3" onSubmit={handleSchedule}>
              <div>
                <label className="text-xs text-slate-500">Language</label>
                <input value={language} onChange={(e)=>setLanguage(e.target.value)} className="w-full mt-1 p-2 rounded border" placeholder="e.g., Spanish"/>
              </div>
              <div>
                <label className="text-xs text-slate-500">Partner (email, optional)</label>
                <input value={partnerEmail} onChange={(e)=>setPartnerEmail(e.target.value)} className="w-full mt-1 p-2 rounded border" placeholder="partner@example.com"/>
              </div>
              <div>
                <label className="text-xs text-slate-500">Start time</label>
                <input value={startTime} onChange={(e)=>setStartTime(e.target.value)} type="datetime-local" className="w-full mt-1 p-2 rounded border"/>
              </div>
              <button type="submit" className="w-full py-2 rounded-full bg-indigo-600 text-white">Schedule</button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}
