// src/pages/dashboard/SessionsPage.jsx
import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
const BACKEND = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function SessionsPage() {
  const { user: authUser, mongoUser, refreshMongoUser } = useAuth();
  const [following, setFollowing] = useState([]);
  const [loadingFollowing, setLoadingFollowing] = useState(true);

  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  const myEmail = authUser?.email || mongoUser?.email;

  // Load following (people I follow)
  useEffect(() => {
    async function loadFollowing() {
      setLoadingFollowing(true);
      try {
        if (!myEmail) {
          setFollowing([]);
          return;
        }
        const res = await fetch(`${BACKEND}/users/following/${encodeURIComponent(myEmail)}`);
        const json = await res.json();
        if (json.success) setFollowing(json.users || []);
        else setFollowing([]);
      } catch (err) {
        console.error("Error loading following:", err);
        setFollowing([]);
      } finally {
        setLoadingFollowing(false);
      }
    }
    loadFollowing();
  }, [myEmail]);

  // Load sessions (incoming & outgoing)
  useEffect(() => {
    async function loadSessions() {
      setLoadingSessions(true);
      try {
        if (!myEmail) {
          setSessions([]);
          return;
        }
        const res = await fetch(`${BACKEND}/sessions?email=${encodeURIComponent(myEmail)}`);
        const json = await res.json();
        if (json.success) setSessions(json.sessions || []);
        else setSessions([]);
      } catch (err) {
        console.error("Error loading sessions:", err);
        setSessions([]);
      } finally {
        setLoadingSessions(false);
      }
    }
    loadSessions();
    // optionally poll every 15s or use websockets to update in realtime
    const iv = setInterval(loadSessions, 15000);
    return () => clearInterval(iv);
  }, [myEmail]);

  const requestSession = async (toEmail, toUserId) => {
    if (!myEmail) return alert("Please sign in first");
    const body = {
      fromEmail: myEmail,
      toEmail,
      scheduledAt: null,
      durationMinutes: 10,
      message: "I'd like to practice speaking — can we schedule a quick session?"
    };
    try {
      const res = await fetch(`${BACKEND}/sessions/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.success) {
        alert("Session request sent!");
        // refresh sessions (and optionally mongo user)
        const sres = await fetch(`${BACKEND}/sessions?email=${encodeURIComponent(myEmail)}`);
        const sjson = await sres.json();
        if (sjson.success) setSessions(sjson.sessions || []);
      } else {
        alert("Failed: " + (json.message || "Unknown"));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send request");
    }
  };

  const acceptSession = async (sessionId) => {
    if (!myEmail) return alert("Please sign in");
    try {
      const res = await fetch(`${BACKEND}/sessions/${sessionId}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionByEmail: myEmail }),
      });
      const json = await res.json();
      if (json.success) {
        alert("Session accepted");
        // refresh session list
        const sres = await fetch(`${BACKEND}/sessions?email=${encodeURIComponent(myEmail)}`);
        const sjson = await sres.json();
        if (sjson.success) setSessions(sjson.sessions || []);
      } else {
        alert("Failed: " + (json.message || "Unknown"));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to accept session");
    }
  };

  // split sessions into incoming / outgoing / accepted
  const incoming = sessions.filter(s => s.toEmail?.toLowerCase() === myEmail?.toLowerCase() && s.status === "pending");
  const outgoing = sessions.filter(s => s.fromEmail?.toLowerCase() === myEmail?.toLowerCase() && s.status === "pending");
  const accepted = sessions.filter(s => s.status === "accepted");

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Sessions</h2>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Your Followings</h3>
        {loadingFollowing ? <div>Loading...</div> : (
          following.length ? (
            <ul className="grid gap-3">
              {following.map(f => (
                <li key={f._id} className="flex items-center justify-between p-3 bg-white rounded shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100 grid place-items-center text-lg">{(f.name || f.email || "U")[0]}</div>
                    <div>
                      <div className="font-medium">{f.name || "Unnamed"}</div>
                      <div className="text-xs text-gray-500">{f.email}</div>
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => requestSession(f.email, f._id)}
                      className="px-3 py-1 rounded bg-indigo-600 text-white"
                    >
                      Request Session
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : <div className="text-sm text-gray-500">You are not following anyone yet.</div>
        )}
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Incoming Requests</h3>
        {loadingSessions ? <div>Loading...</div> : (
          incoming.length ? (
            <ul className="space-y-2">
              {incoming.map(s => (
                <li key={s._id} className="p-3 bg-white rounded shadow flex justify-between items-center">
                  <div>
                    <div className="font-medium">{s.fromName || s.fromEmail}</div>
                    <div className="text-sm text-gray-500">{s.message}</div>
                    <div className="text-xs text-gray-400">Requested {new Date(s.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 rounded bg-green-600 text-white" onClick={() => acceptSession(s._id)}>Accept</button>
                    <button className="px-3 py-1 rounded border" onClick={() => alert("Reject functionality coming soon")}>Reject</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : <div className="text-sm text-gray-500">No incoming requests</div>
        )}
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Outgoing Requests</h3>
        {loadingSessions ? <div>Loading...</div> : (
          outgoing.length ? (
            <ul className="space-y-2">
              {outgoing.map(s => (
                <li key={s._id} className="p-3 bg-white rounded shadow flex justify-between items-center">
                  <div>
                    <div className="font-medium">To {s.toName || s.toEmail}</div>
                    <div className="text-sm text-gray-500">{s.message}</div>
                    <div className="text-xs text-gray-400">Requested {new Date(s.createdAt).toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800">Pending</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : <div className="text-sm text-gray-500">No outgoing requests</div>
        )}
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">Accepted / Upcoming</h3>
        {accepted.length ? (
          <ul className="space-y-2">
            {accepted.map(s => (
              <li key={s._id} className="p-3 bg-white rounded shadow flex justify-between items-center">
                <div>
                  <div className="font-medium">{s.fromEmail === myEmail ? `With ${s.toName||s.toEmail}` : `With ${s.fromName||s.fromEmail}`}</div>
                  <div className="text-xs text-gray-400">Status: {s.status} • {s.scheduledAt ? new Date(s.scheduledAt).toLocaleString() : "No scheduled time"}</div>
                </div>
                <div>
                  <a href="/meet" className="px-3 py-1 rounded bg-indigo-600 text-white">Start</a>
                </div>
              </li>
            ))}
          </ul>
        ) : <div className="text-sm text-gray-500">No accepted sessions</div>}
      </section>
    </div>
  );
}
