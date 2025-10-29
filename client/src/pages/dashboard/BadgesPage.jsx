// src/pages/dashboard/BadgesPage.jsx
import React from "react";
import useAuth from "../../hooks/useAuth";
import { BADGES } from "../../lib/badges";

export default function BadgesPage() {
  const { mongoUser } = useAuth();
  const earned = new Set(
    (mongoUser?.badges || []).map((b) => String(b).toLowerCase())
  );
  const sessionsDone = Number(mongoUser?.evaluationsCount || 0);

  return (
    <div>
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">
        Badges & Achievements
      </h2>

      <div className="bg-white p-4 rounded-2xl shadow mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-slate-600">
            Earn badges by completing sessions and contributing to the
            community. Badges motivate learners and show progress.
          </p>
          <div className="text-sm font-medium text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
            Total sessions completed:{" "}
            <span className="font-semibold">{sessionsDone}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {BADGES.map((b) => {
          const has = earned.has(b.id);
          const threshold = Number(b.threshold || 0);
          const progress =
            threshold > 0
              ? Math.min(100, Math.round((sessionsDone / threshold) * 100))
              : 0;
          const remaining = Math.max(0, threshold - sessionsDone);

          return (
            <div
              key={b.id}
              className={`p-6 rounded-2xl shadow relative overflow-hidden ${
                has ? "" : "opacity-95"
              }`}
            >
              {/* Badge monogram */}
              <div
                className={`w-24 h-24 rounded-full grid place-items-center text-white font-bold mb-4 bg-gradient-to-tr ${b.color}`}
                aria-label={`${b.name} badge`}
              >
                {b.name
                  .split(" ")
                  .map((s) => s[0])
                  .slice(0, 2)
                  .join("")}
              </div>

              <div className="font-semibold flex items-center gap-2">
                {b.name}
                {has && (
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">
                    Earned
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 mt-1">{b.desc}</div>

              {/* Progress */}
              {threshold > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>
                      {sessionsDone}/{threshold} sessions
                    </span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${b.color}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  {!has && remaining > 0 && (
                    <div className="mt-2 text-[11px] text-slate-500">
                      {remaining} more to unlock {b.name.split(" ")[0]}.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
