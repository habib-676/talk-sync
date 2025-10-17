// src/pages/dashboard/LearnerOverview.jsx
import React, { useEffect, useState } from "react";
import NextSessionCard from "../../components/dashboard/widgets/NextSessionCard";
import ProgressDonut from "../../components/dashboard/widgets/ProgressDonut";
import SuggestedPartners from "../../components/dashboard/widgets/SuggestedPartners";
import useAuth from "../../hooks/useAuth";

const BACKEND =
  import.meta.env.VITE_API_URL || "${import.meta.env.VITE_API_URL}";

export default function LearnerOverview() {
  const { user: authUser } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const email = (authUser?.email || localStorage.getItem("demoEmail") || "")
      .toLowerCase()
      .trim();
    if (!email) {
      setError("No email available. Sign in or set demoEmail in localStorage.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const url = `${BACKEND.replace(
          /\/$/,
          ""
        )}/dashboard/overview?email=${encodeURIComponent(email)}`;
        const res = await fetch(url);
        const json = await res.json();
        if (!json.success)
          throw new Error(json.message || "Failed to fetch summary");
        setSummary(json.summary);
      } catch (err) {
        console.error("Overview fetch error:", err);
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, [authUser]);

  return (
    <div className="space-y-6">
      {loading && <div className="p-6 bg-white rounded-md">Loading...</div>}
      {error && (
        <div className="p-6 bg-red-50 text-red-700 rounded-md">{error}</div>
      )}

      {!loading && !error && summary && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <NextSessionCard nextSession={summary.nextSession} />
            <div className="bg-white rounded-2xl p-6 shadow">
              <h3 className="text-lg font-semibold text-indigo-600 mb-3">
                Recent stats
              </h3>
              <div className="flex gap-4">
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="text-sm text-gray-500">
                    Sessions this week
                  </div>
                  <div className="text-xl font-bold">
                    {summary.sessionsThisWeek}
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="text-sm text-gray-500">Badges</div>
                  <div className="text-xl font-bold">
                    {(summary.badges || []).length}
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="text-sm text-gray-500">Learners</div>
                  <div className="text-xl font-bold">
                    {summary.learners.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow">
              <h3 className="text-lg font-semibold text-indigo-600 mb-3">
                Community
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {summary.learners.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Learners</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{summary.countries}</div>
                  <div className="text-xs text-gray-500">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{summary.languages}</div>
                  <div className="text-xs text-gray-500">Languages</div>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow">
              <h3 className="text-lg font-semibold text-indigo-600">
                Progress
              </h3>
              <div className="mt-4 flex items-center justify-center">
                <ProgressDonut points={summary.points} />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow">
              <h3 className="text-lg font-semibold text-indigo-600">
                Suggested partners
              </h3>
              <SuggestedPartners partners={summary.suggestedPartners} />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
