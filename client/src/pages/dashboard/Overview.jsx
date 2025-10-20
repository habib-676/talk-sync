// src/pages/dashboard/Overview.jsx
import React, { useEffect, useState } from "react";
import NextSessionCard from "../../components/dashboard/widgets/NextSessionCard";
import ProgressDonut from "../../components/dashboard/widgets/ProgressDonut";
import SuggestedPartners from "../../components/dashboard/widgets/SuggestedPartners";
import useAuth from "../../hooks/useAuth";

<<<<<<< HEAD
<<<<<<< Updated upstream
const BACKEND = import.meta.env.VITE_API_URL || "http://localhost:5000";
=======
const BACKEND =
  import.meta.env.VITE_API_URL || "${import.meta.env.VITE_API_URL}";
>>>>>>> Stashed changes
=======
const BACKEND =
  import.meta.env.VITE_API_URL || "${import.meta.env.VITE_API_URL}";
>>>>>>> e9ab4032b463353a7abc31fbc945f83783bedff0

export default function Overview() {
  const { user: authUser } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
<<<<<<< HEAD
<<<<<<< Updated upstream
    const email = (authUser?.email || localStorage.getItem("demoEmail") || "").toLowerCase().trim();
=======
    const email = (authUser?.email || localStorage.getItem("demoEmail") || "")
      .toLowerCase()
      .trim();
>>>>>>> Stashed changes
=======
    const email = (authUser?.email || localStorage.getItem("demoEmail") || "")
      .toLowerCase()
      .trim();
>>>>>>> e9ab4032b463353a7abc31fbc945f83783bedff0
    if (!email) {
      setError("No email available. Sign in or set demoEmail in localStorage.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);
<<<<<<< HEAD
<<<<<<< Updated upstream
        const url = `${BACKEND.replace(/\/$/, "")}/dashboard/overview?email=${encodeURIComponent(email)}`;
        const res = await fetch(url);
        const json = await res.json();
        if (!json.success) throw new Error(json.message || "Failed to fetch summary");
=======
        const url = `${BACKEND.replace(
          /\/$/,
          ""
        )}/dashboard/overview?email=${encodeURIComponent(email)}`;
        const res = await fetch(url);
        const json = await res.json();
        if (!json.success)
          throw new Error(json.message || "Failed to fetch summary");
>>>>>>> Stashed changes
=======
        const url = `${BACKEND.replace(
          /\/$/,
          ""
        )}/dashboard/overview?email=${encodeURIComponent(email)}`;
        const res = await fetch(url);
        const json = await res.json();
        if (!json.success)
          throw new Error(json.message || "Failed to fetch summary");
>>>>>>> e9ab4032b463353a7abc31fbc945f83783bedff0
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
<<<<<<< HEAD
<<<<<<< Updated upstream
=======
    <div className="space-y-6">
      {loading && <div className="p-6 bg-white rounded-md">Loading...</div>}
      {error && (
        <div className="p-6 bg-red-50 text-red-700 rounded-md">{error}</div>
      )}
>>>>>>> e9ab4032b463353a7abc31fbc945f83783bedff0

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
<<<<<<< HEAD
                  <div className="text-center">
                    <div className="text-2xl font-bold">{summary.countries}</div>
                    <div className="text-xs text-gray-500">Countries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{summary.languages}</div>
                    <div className="text-xs text-gray-500">Languages</div>
=======
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
=======
>>>>>>> e9ab4032b463353a7abc31fbc945f83783bedff0
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="text-sm text-gray-500">Learners</div>
                  <div className="text-xl font-bold">
                    {summary.learners.toLocaleString()}
<<<<<<< HEAD
>>>>>>> Stashed changes
=======
>>>>>>> e9ab4032b463353a7abc31fbc945f83783bedff0
                  </div>
                </div>
              </div>
            </div>

<<<<<<< HEAD
<<<<<<< Updated upstream
            <aside className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow">
                <h3 className="text-lg font-semibold text-indigo-600">Progress</h3>
                <div className="mt-4 flex items-center justify-center">
                  <ProgressDonut points={summary.points} />
=======
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
>>>>>>> e9ab4032b463353a7abc31fbc945f83783bedff0
                </div>
              </div>
            </div>
          </div>
<<<<<<< HEAD
        )}
      </div>
=======
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
=======
>>>>>>> e9ab4032b463353a7abc31fbc945f83783bedff0

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
<<<<<<< HEAD
>>>>>>> Stashed changes
=======
>>>>>>> e9ab4032b463353a7abc31fbc945f83783bedff0
  );
}
