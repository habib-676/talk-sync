import React, { useEffect, useState, useCallback } from "react";
import NextSessionCard from "../../components/dashboard/widgets/NextSessionCard";
import ProgressDonut from "../../components/dashboard/widgets/ProgressDonut";
import SuggestedPartners from "../../components/dashboard/widgets/SuggestedPartners";
import useAuth from "../../hooks/useAuth";
import { RefreshCw, Clock, Users, Star } from "lucide-react";

const BACKEND =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:5000";

function StatCard({ label, value, icon, colorFrom, colorTo }) {
  return (
    <div
      className="rounded-2xl p-4 shadow-md hover:shadow-lg transition-transform hover:-translate-y-1 duration-200"
      style={{
        background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})`,
        color: "#1f2937",
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-600">{label}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
        <div className="bg-white/40 p-2 rounded-lg text-gray-700">{icon}</div>
      </div>
    </div>
  );
}

export default function Overview() {
  const { user: authUser } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedNext, setExpandedNext] = useState(true);

  const email = (authUser?.email || localStorage.getItem("demoEmail") || "")
    .toLowerCase()
    .trim();

  const fetchSummary = useCallback(async (signal) => {
    if (!email) {
      setError("No email available. Sign in or set demoEmail in localStorage.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const url = `${BACKEND.replace(
        /\/$/,
        ""
      )}/dashboard/overview?email=${encodeURIComponent(email)}`;
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
    <div className="space-y-6 p-6 bg-gradient-to-br from-indigo-50 via-pink-50 to-emerald-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Overview</h1>
          <p className="text-sm text-slate-500 mt-1">
            Your progress, sessions, and learning community at a glance
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-pink-400 text-white shadow hover:scale-105 transition"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="bg-white p-6 rounded-2xl shadow animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-24 bg-gray-100 rounded" />
        </div>
      )}
      {error && (
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl shadow">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Summary */}
      {!loading && !error && summary && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Next Session */}
            <div className="bg-gradient-to-r from-indigo-100 to-pink-100 rounded-2xl p-6 shadow-lg transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-white shadow text-indigo-600">
                    <Clock />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-indigo-600">
                      Next Session
                    </div>
                    <div className="text-lg font-bold text-slate-800">
                      {summary.nextSession
                        ? new Date(
                            summary.nextSession.startTime ||
                              summary.nextSession.scheduledAt
                          ).toLocaleString()
                        : "No upcoming session"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setExpandedNext((s) => !s)}
                    className="px-3 py-1 text-sm bg-white/70 rounded-full shadow hover:bg-white transition"
                  >
                    {expandedNext ? "Collapse" : "Expand"}
                  </button>
                  <a
                    href="/dashboard/sessions"
                    className="px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-pink-400 text-white shadow hover:scale-105 transition"
                  >
                    Book Session
                  </a>
                </div>
              </div>

              {expandedNext && (
                <div className="mt-4">
                  <NextSessionCard nextSession={summary.nextSession} />
                </div>
              )}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                label="Sessions this week"
                value={summary.sessionsThisWeek ?? 0}
                icon={<Clock />}
                colorFrom="#E0EAFF"
                colorTo="#F8F4FF"
              />
              <StatCard
                label="Active learners"
                value={summary.learners?.toLocaleString() || 0}
                icon={<Users />}
                colorFrom="#E6F7F3"
                colorTo="#FFF8E7"
              />
              <StatCard
                label="Badges earned"
                value={(summary.badges || []).length}
                icon={<Star />}
                colorFrom="#FFF1DA"
                colorTo="#FDECEF"
              />
            </div>

            {/* Community Section */}
            <div className="bg-white rounded-2xl p-6 shadow">
              <h3 className="text-lg font-semibold text-indigo-600 mb-3">
                Community
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {summary.learners.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Learners</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-500">
                    {summary.countries}
                  </div>
                  <div className="text-xs text-gray-500">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-500">
                    {summary.languages}
                  </div>
                  <div className="text-xs text-gray-500">Languages</div>
                </div>
              </div>
            </div>

            {/* Suggested Partners */}
            <div className="bg-white rounded-2xl p-6 shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-indigo-600">
                  Suggested Partners
                </h3>
              </div>
              <div className="flex gap-4 overflow-x-auto py-2 scrollbar-thin">
                {summary.suggestedPartners?.length ? (
                  summary.suggestedPartners.map((p) => (
                    <div
                      key={p.email}
                      className="min-w-[200px] bg-gradient-to-br from-indigo-50 to-pink-50 rounded-xl p-4 shadow hover:scale-105 transition"
                    >
                      <SuggestedPartners partners={[p]} />
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">
                    No suggestions right now.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <aside className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow text-center">
              <h3 className="text-lg font-semibold text-indigo-600">
                Progress
              </h3>
              <div className="mt-4 flex items-center justify-center">
                <ProgressDonut points={summary.points} />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Keep learning and practicing to unlock more badges!
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
