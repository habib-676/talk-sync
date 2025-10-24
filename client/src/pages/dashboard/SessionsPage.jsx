// src/pages/dashboard/SessionsPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import useAuth from "../../hooks/useAuth";
import { Clock, Send, Check, X, UserPlus, Calendar } from "lucide-react";

const BACKEND = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SkeletonCard = () => (
  <div className="animate-pulse p-4 rounded-2xl bg-gradient-to-r from-slate-100 to-white shadow">
    <div className="flex items-center gap-3">
      <div className="rounded-full bg-slate-200 w-12 h-12" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-4 bg-slate-200 rounded w-1/2" />
        <div className="h-3 bg-slate-200 rounded w-1/3" />
      </div>
    </div>
  </div>
);

export default function SessionsPage() {
  const { user: authUser, mongoUser, refreshMongoUser } = useAuth();
  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(true);

  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  const [tab, setTab] = useState("friends"); // friends | incoming | outgoing | upcoming | history
  const [error, setError] = useState(null);

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState(null);
  const [scheduleAt, setScheduleAt] = useState("");
  const [message, setMessage] = useState(
    "I'd like to practice speaking — are you available?"
  );
  const [submitting, setSubmitting] = useState(false);

  const [feedbackStatus, setFeedbackStatus] = useState({}); // { [sessionId]: { meSubmitted: bool, doc: object|null } }

  const myEmail = (authUser?.email || mongoUser?.email || "").toLowerCase();

  // ---------- Friend loading ----------
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingFriends(true);
      try {
        const friendIds = Array.isArray(mongoUser?.friends) ? mongoUser.friends : [];

        if (!friendIds.length) {
          if (mounted) setFriends([]);
          return;
        }

        const results = await Promise.all(
          friendIds.map(async (id) => {
            try {
              const res = await fetch(`${BACKEND}/users/id/${encodeURIComponent(id)}`);
              const json = await res.json();
              // backend returns { success:true, user } OR raw user; handle both
              return json?.user ?? json;
            } catch (err) {
              console.error("friend fetch failed", id, err);
              return null;
            }
          })
        );
        const valid = results.filter(Boolean);
        if (mounted) setFriends(valid);
      } catch (err) {
        console.error("Error loading friends", err);
        if (mounted) setError("Failed to load friends.");
      } finally {
        if (mounted) setLoadingFriends(false);
      }
    })();
    return () => (mounted = false);
  }, [mongoUser?.friends]);

  // ---------- Sessions loading ----------
  const loadSessions = useCallback(async () => {
    setLoadingSessions(true);
    setError(null);
    try {
      if (!myEmail) {
        setSessions([]);
        return;
      }
      const res = await fetch(`${BACKEND}/sessions?email=${encodeURIComponent(myEmail)}`);
      const json = await res.json();
      const data = json?.sessions ?? (json?.success ? json.sessions : json);
      setSessions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading sessions", err);
      setError("Failed to load sessions. Is backend running?");
      setSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  }, [myEmail]);

  useEffect(() => {
    loadSessions();
    const iv = setInterval(loadSessions, 15000); // auto refresh
    return () => clearInterval(iv);
  }, [loadSessions]);

  // ---------- Feedback status loader (for upcoming sessions) ----------
  useEffect(() => {
    // load feedback doc for each accepted session to know whether current user submitted
    const accepted = sessions.filter((s) => s.status === "accepted");
    if (!accepted.length || !myEmail) {
      setFeedbackStatus({});
      return;
    }

    let mounted = true;
    (async () => {
      try {
        const pairs = await Promise.all(
          accepted.map(async (s) => {
            try {
              const res = await fetch(
                `${BACKEND}/sessions/${encodeURIComponent(s._id)}/feedback?email=${encodeURIComponent(myEmail)}`
              );
              if (!res.ok) {
                // we still return a default shape
                return [s._id, { meSubmitted: false, doc: null }];
              }
              const json = await res.json();
              if (!json.success) {
                return [s._id, { meSubmitted: false, doc: json.feedback || null }];
              }
              const doc = json.feedback || json; // backend shape may vary
              const meResp = (doc.responses && doc.responses[myEmail]) || (Array.isArray(doc.responses) && doc.responses.find(r => r.email === myEmail));
              const meSubmitted = Boolean(meResp);
              return [s._id, { meSubmitted, doc }];
            } catch (err) {
              console.error("feedback check failed for", s._id, err);
              return [s._id, { meSubmitted: false, doc: null }];
            }
          })
        );
        if (mounted) {
          const map = Object.fromEntries(pairs);
          setFeedbackStatus(map);
        }
      } catch (err) {
        console.error("Failed to load feedback status", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [sessions, myEmail]);

  // ---------- Modal helpers ----------
  const openRequestModal = (friend) => {
    setModalTarget(friend);
    setScheduleAt("");
    setMessage("I'd like to practice speaking — are you available?");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalTarget(null);
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    if (!modalTarget) return;
    if (!myEmail) return alert("Sign in first");

    setSubmitting(true);
    try {
      const payload = {
        fromEmail: myEmail,
        fromName: authUser?.displayName || mongoUser?.name || "",
        toEmail: modalTarget.email,
        toName: modalTarget.name || "",
        scheduledAt: scheduleAt || null,
        durationMinutes: 10,
        message,
      };
      const res = await fetch(`${BACKEND}/sessions/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json?.success) {
        closeModal();
        await loadSessions();
        refreshMongoUser && refreshMongoUser();
        // subtle success feedback (swap with toast if you use toast lib)
        alert("Session request sent 🎉");
      } else {
        alert("Request failed: " + (json?.message || "unknown error"));
      }
    } catch (err) {
      console.error("submitRequest error", err);
      alert("Failed to send request.");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- Accept / Reject ----------
  const acceptSession = async (sessionId) => {
    if (!myEmail) return alert("Sign in first");
    try {
      const res = await fetch(`${BACKEND}/sessions/${encodeURIComponent(sessionId)}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionByEmail: myEmail }),
      });
      const json = await res.json();
      if (json?.success) {
        await loadSessions();
        alert("Accepted ✅");
      } else {
        alert("Accept failed: " + (json?.message || "unknown"));
      }
    } catch (err) {
      console.error("acceptSession", err);
      alert("Failed to accept.");
    }
  };

  const rejectSession = async (sessionId) => {
    if (!window.confirm("Reject this session request?")) return;
    try {
      const res = await fetch(`${BACKEND}/sessions/${encodeURIComponent(sessionId)}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionByEmail: myEmail }),
      });
      const json = await res.json();
      if (json?.success) {
        await loadSessions();
        alert("Rejected");
      } else {
        alert("Reject failed");
      }
    } catch (err) {
      console.error("rejectSession", err);
      alert("Failed to reject.");
    }
  };

  // ---------- Derived sets ----------
  const incoming = sessions.filter(
    (s) =>
      s.toEmail?.toLowerCase() === myEmail?.toLowerCase() &&
      s.status === "pending"
  );
  const outgoing = sessions.filter(
    (s) =>
      s.fromEmail?.toLowerCase() === myEmail?.toLowerCase() &&
      s.status === "pending"
  );
  const accepted = sessions.filter((s) => s.status === "accepted");
  const history = sessions.filter(
    (s) =>
      ["completed", "rejected", "cancelled", "cancelled"].includes(s.status) ||
      (s.status === "accepted" && s.endTime)
  );

  // ---------- UI ----------
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-pink-500 to-amber-400">
            Sessions
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Book 1:1 speaking sessions with friends. Aim for 10+ minutes to
            count toward progress.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              loadSessions();
              refreshMongoUser && refreshMongoUser();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow hover:shadow-md border"
          >
            <Clock size={16} /> Refresh
          </button>
          <button
            onClick={() => setTab("friends")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white shadow"
            title="See friends"
          >
            <UserPlus size={16} /> My Friends
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 bg-white/60 rounded-2xl p-3 flex flex-wrap gap-2 items-center shadow-sm">
        {[
          { key: "friends", label: "Friends" },
          { key: "incoming", label: `Incoming (${incoming.length})` },
          { key: "outgoing", label: `Outgoing (${outgoing.length})` },
          { key: "upcoming", label: `Upcoming (${accepted.length})` },
          { key: "history", label: `History (${history.length})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg transition ${
              tab === t.key
                ? "bg-gradient-to-r from-indigo-600 to-pink-500 text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && <div className="mb-4 text-red-600">{error}</div>}

      {/* CONTENT SWITCH */}
      <div>
        {tab === "friends" && (
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {loadingFriends ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              ) : friends.length ? (
                friends.map((f) => (
                  <div
                    key={f._id || f.email}
                    className="group relative p-4 rounded-2xl bg-gradient-to-br from-white to-white/90 shadow hover:shadow-xl transform hover:-translate-y-1 transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-full grid place-items-center text-lg font-bold bg-gradient-to-br from-indigo-100 to-pink-100 text-indigo-700">
                        {f.name
                          ? f.name
                              .split(" ")
                              .map((a) => a[0])
                              .slice(0, 2)
                              .join("")
                          : (f.email || "U")[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="font-semibold text-slate-800">
                              {f.name || f.email}
                            </div>
                            <div className="text-xs text-gray-500">
                              {f.native_language ? `${f.native_language} • ` : ""}
                              {f.email}
                            </div>
                          </div>
                          <div className="text-xs text-gray-400">
                            {f.status || "Offline"}
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-gray-600 line-clamp-3">
                          {f.bio || "No bio yet."}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs">
                          Native: {f.native_language || "—"}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs">
                          Learning: {(f.learning_language && f.learning_language[0]) || "—"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openRequestModal(f)}
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white shadow hover:brightness-105"
                        >
                          <Send size={14} /> Request
                        </button>
                        <Link
                          to={`/dashboard/profile?user=${encodeURIComponent(f.email)}`}
                          className="text-xs text-gray-500 hover:underline"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full p-6 text-center text-gray-500 bg-white rounded-2xl shadow">
                  No friends yet — follow users to make friends.
                </div>
              )}
            </div>
          </section>
        )}

        {tab === "incoming" && (
          <section>
            <div className="grid gap-4">
              {loadingSessions ? (
                <div>Loading...</div>
              ) : incoming.length ? (
                incoming.map((s) => (
                  <div
                    key={s._id}
                    className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-white shadow flex justify-between items-center"
                  >
                    <div>
                      <div className="font-semibold">{s.fromName || s.fromEmail}</div>
                      <div className="text-sm text-gray-600">{s.message}</div>
                      <div className="text-xs text-gray-400 mt-2">
                        Requested: {new Date(s.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => acceptSession(s._id)}
                        className="px-3 py-1 rounded bg-green-600 text-white inline-flex items-center gap-2"
                      >
                        <Check size={14} /> Accept
                      </button>
                      <button
                        onClick={() => rejectSession(s._id)}
                        className="px-3 py-1 rounded border inline-flex items-center gap-2 text-sm"
                      >
                        <X size={14} /> Reject
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-gray-500">No incoming requests</div>
              )}
            </div>
          </section>
        )}

        {tab === "outgoing" && (
          <section>
            <div className="grid gap-4">
              {loadingSessions ? (
                <div>Loading...</div>
              ) : outgoing.length ? (
                outgoing.map((s) => (
                  <div
                    key={s._id}
                    className="p-4 rounded-2xl bg-white shadow flex justify-between items-center"
                  >
                    <div>
                      <div className="font-semibold">To {s.toName || s.toEmail}</div>
                      <div className="text-sm text-gray-600">{s.message}</div>
                      <div className="text-xs text-gray-400 mt-2">
                        Requested: {new Date(s.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800">Pending</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-gray-500">No outgoing requests</div>
              )}
            </div>
          </section>
        )}

        {tab === "upcoming" && (
          <section>
            <div className="grid gap-4">
              {loadingSessions ? (
                <div>Loading...</div>
              ) : accepted.length ? (
                accepted.map((s) => {
                  const status = feedbackStatus[s._id] || { meSubmitted: false };
                  const meSubmitted = !!status.meSubmitted;
                  return (
                    <div
                      key={s._id}
                      className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-white shadow flex justify-between items-center"
                    >
                      <div>
                        <div className="font-semibold">
                          {s.fromEmail === myEmail ? `With ${s.toName || s.toEmail}` : `With ${s.fromName || s.fromEmail}`}
                        </div>
                        <div className="text-xs text-gray-500">
                          Scheduled: {s.scheduledAt ? new Date(s.scheduledAt).toLocaleString() : "No scheduled time"}
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Link
                          to={`/meet?session=${encodeURIComponent(s._id)}`}
                          className="px-3 py-1 rounded bg-indigo-600 text-white inline-flex items-center gap-2"
                        >
                          <Clock size={14} /> Start
                        </Link>

                        {/* Feedback button + state */}
                        {meSubmitted ? (
                          <button
                            className="px-3 py-1 rounded bg-gray-200 text-gray-700 inline-flex items-center gap-2"
                            title="You already submitted feedback"
                          >
                            ✅ Submitted
                          </button>
                        ) : (
                          <Link
                            to={`/dashboard/feedback/${encodeURIComponent(s._id)}`}
                            className="px-3 py-1 rounded bg-gradient-to-r from-indigo-600 to-pink-500 text-white inline-flex items-center gap-2"
                            title="Give feedback for this session"
                          >
                            <Clock size={14} /> Feedback
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-gray-500">No upcoming sessions</div>
              )}
            </div>
          </section>
        )}

        {tab === "history" && (
          <section>
            <div className="grid gap-3">
              {loadingSessions ? (
                <div>Loading...</div>
              ) : history.length ? (
                history.map((s) => (
                  <div
                    key={s._id}
                    className="p-3 rounded-2xl bg-white shadow flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">
                        {s.fromEmail === myEmail ? `With ${s.toName || s.toEmail}` : `With ${s.fromName || s.fromEmail}`}
                      </div>
                      <div className="text-xs text-gray-500">
                        {s.status} •{" "}
                        {s.endTime ? `Ended ${new Date(s.endTime).toLocaleString()}` : `Requested ${new Date(s.createdAt).toLocaleString()}`}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{s.durationMinutes ? `${s.durationMinutes} min` : "-"}</div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-gray-500">No session history</div>
              )}
            </div>
          </section>
        )}
      </div>

      {/* -------- REQUEST MODAL -------- */}
      {modalOpen && modalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <form onSubmit={submitRequest} className="relative z-60 max-w-2xl w-full bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full grid place-items-center bg-gradient-to-br from-indigo-100 to-pink-100 text-indigo-700 font-bold">
                  {modalTarget.name ? modalTarget.name.split(" ").map((n) => n[0]).slice(0, 2).join("") : (modalTarget.email || "U")[0].toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold">{modalTarget.name || modalTarget.email}</div>
                  <div className="text-xs text-gray-500">{modalTarget.email}</div>
                </div>
              </div>
              <button type="button" onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex flex-col">
                <span className="text-xs text-gray-600 mb-1">Schedule (optional)</span>
                <input type="datetime-local" value={scheduleAt} onChange={(e) => setScheduleAt(e.target.value)} className="px-3 py-2 rounded border focus:outline-none" />
              </label>

              <label className="flex flex-col">
                <span className="text-xs text-gray-600 mb-1">Duration</span>
                <div className="inline-flex items-center gap-2">
                  <span className="px-3 py-2 rounded bg-slate-100">10 min</span>
                  <span className="text-xs text-gray-500">Fixed for demo</span>
                </div>
              </label>
            </div>

            <label className="block mt-4">
              <span className="text-xs text-gray-600">Message</span>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="w-full mt-2 p-3 rounded border focus:outline-none" />
            </label>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="text-sm text-gray-500">
                <Calendar size={14} className="inline-block mr-1" />
                {scheduleAt ? `Scheduled for ${new Date(scheduleAt).toLocaleString()}` : "No scheduled time — request will be sent as pending"}
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded border">Cancel</button>
                <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gradient-to-r from-indigo-600 to-pink-500 text-white shadow">
                  <Send size={14} /> {submitting ? "Sending..." : "Send Request"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
