// src/components/dashboard/widgets/NextSessionCard.jsx
import React from "react";

export default function NextSessionCard({ nextSession }) {
  if (!nextSession) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow">
        <h3 className="text-lg font-semibold">Next session</h3>
        <p className="text-sm text-gray-500 mt-2">No upcoming sessions. Try Quick Match!</p>
      </div>
    );
  }

  const timeStr = nextSession.startTime ? new Date(nextSession.startTime).toLocaleString() : nextSession.time || "TBD";
  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">Next session</h3>
          <div className="text-sm text-gray-500 mt-2">{nextSession.title || "Practice session"}</div>
          <div className="text-sm text-gray-600 mt-2">When: {timeStr}</div>
          <div className="text-sm text-gray-600 mt-1">With: {nextSession.partner || nextSession.partnerName || "Partner"}</div>
        </div>
        <div className="flex flex-col gap-2">
          <a href={nextSession.joinUrl || "#"} className="px-3 py-2 rounded-full bg-indigo-600 text-white">Join</a>
          <button className="px-3 py-2 rounded-full border">Details</button>
        </div>
      </div>
    </div>
  );
}
