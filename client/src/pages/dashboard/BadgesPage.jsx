// src/pages/dashboard/BadgesPage.jsx
import React from "react";
import useAuth from "../../hooks/useAuth";

const BADGES = [
  { id: "bronze", name: "Bronze Speaker", desc: "Complete 5 sessions", color: "from-yellow-300 to-orange-400" },
  { id: "silver", name: "Silver Speaker", desc: "Complete 20 sessions", color: "from-slate-200 to-slate-400" },
  { id: "gold", name: "Gold Speaker", desc: "Complete 50 sessions", color: "from-amber-400 to-yellow-500" },
];

export default function BadgesPage() {
  const { mongoUser } = useAuth();
  const earned = new Set((mongoUser?.badges || []).map(b => String(b).toLowerCase()));

  return (
    <div>
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">Badges & Achievements</h2>

      <div className="bg-white p-4 rounded-2xl shadow mb-6">
        <p className="text-sm text-slate-600">Earn badges by completing sessions and contributing to the community. Badges motivate learners and show progress.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {BADGES.map(b => {
          const has = earned.has(b.id);
          return (
            <div key={b.id} className={`p-6 rounded-2xl shadow ${has ? "" : "opacity-60"}`}>
              <div className={`w-24 h-24 rounded-full grid place-items-center text-white font-bold mb-4 bg-gradient-to-tr ${b.color}`}>
                {b.name.split(" ").map(s => s[0]).slice(0,2).join("")}
              </div>
              <div className="font-semibold">{b.name}</div>
              <div className="text-xs text-slate-500 mt-1">{b.desc}</div>
              <div className="mt-3">
                {has ? <span className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full">Earned</span> : <span className="text-sm px-3 py-1 bg-gray-100 rounded-full">Locked</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
