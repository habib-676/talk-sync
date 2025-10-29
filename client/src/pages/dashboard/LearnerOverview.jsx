// src/pages/dashboard/LearnerOverview.jsx
import React, { useEffect, useState, useCallback } from "react";
import { RefreshCw, Clock, Users, Star } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import NextSessionCard from "../../components/dashboard/widgets/NextSessionCard";
import ProgressDonut from "../../components/dashboard/widgets/ProgressDonut";
import SuggestedPartners from "../../components/dashboard/widgets/SuggestedPartners";

const BACKEND = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function StatCard({ label, value, icon, accent }) {
  return (
    <div className="rounded-2xl p-4 shadow-sm bg-white">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500">{label}</div>
          <div className="text-2xl font-bold text-slate-800">{value}</div>
        </div>
        <div className="p-2 rounded-lg bg-slate-50 text-slate-700">{icon}</div>
      </div>
    </div>
  );
}

export default function LearnerOverview() {
  const { user: authUser } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedNext, setExpandedNext] = useState(true);

  const email = (authUser?.email || localStorage.getItem("demoEmail") || "").toLowerCase().trim();

  const fetchSummary = useCallback(async (signal) => {
    if (!email) {
      setError("No email available. Sign in or set demoEmail in localStorage.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const url = `${BACKEND.replace(/\/$/, "")}/dashboard/overview?email=${encodeURIComponent(email)}`;
      const res = await fetch(url, { signal });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to fetch summary");
      setSummary(json.summary);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Overview fetch error:", err);
        setError(err.message || "Failed to load dashboard");
      }
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    const ac = new AbortController();
    fetchSummary(ac.signal);
    return () => ac.abort();
  }, [fetchSummary]);

  const handleRefresh = () => {
    const ac = new AbortController();
    fetchSummary(ac.signal);
  };

  return (
    <div className="space-y-6 p-6 min-h-screen bg-slate-50">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Overview</h1>
          <p className="text-sm text-gray-600 mt-1">Your progress, upcoming session, and community at a glance</p>
        </div>
        <button onClick={handleRefresh} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {loading && <div className="bg-white p-6 rounded-2xl shadow animate-pulse">Loading...</div>}
      {error && <div className="bg-red-50 text-red-700 p-6 rounded-2xl shadow"><strong>Error:</strong> {error}</div>}

      {!loading && !error && summary && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <NextSessionCard
                nextSession={summary.nextSession}
                onDetails={(s) => console.log("details", s)}
                onJoin={(s) => window.location.assign(`/meet?session=${s._id || s.sessionId}`)}
                showFeedbackLink={true}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard label="Sessions this week" value={summary.sessionsThisWeek ?? 0} icon={<Clock />} />
              <StatCard label="Active learners" value={summary.learners?.toLocaleString() || 0} icon={<Users />} />
              <StatCard label="Badges" value={(summary.badges || []).length} icon={<Star />} />
            </div>

            <div className="bg-white rounded-2xl p-6 shadow">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Community</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800">{summary.learners.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Learners</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800">{summary.countries}</div>
                  <div className="text-xs text-gray-500">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800">{summary.languages}</div>
                  <div className="text-xs text-gray-500">Languages</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-800">Suggested partners</h3>
              </div>
              <div className="overflow-x-auto py-2">
                <SuggestedPartners partners={summary.suggestedPartners || []} onRequest={(p) => console.log("request", p)} />
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow text-center">
              <h3 className="text-lg font-semibold text-slate-800">Progress</h3>
              <div className="mt-4 flex items-center justify-center">
                <ProgressDonut points={summary.points} targetPoints={200} />
              </div>
              <p className="text-sm text-gray-600 mt-2">Keep practicing to unlock badges.</p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
