// src/components/dashboard/widgets/ProgressDonut.jsx
import React from "react";

export default function ProgressDonut({ points = 0 }) {
  const pct = Math.min(100, Math.round((points / 200) * 100));
  const style = { background: `conic-gradient(#7C3AED ${pct * 3.6}deg, rgba(0,0,0,0.06) ${pct * 3.6}deg)` };

  return (
    <div className="flex flex-col items-center">
      <div className="w-28 h-28 rounded-full grid place-items-center" style={style}>
        <div className="w-16 h-16 rounded-full bg-white grid place-items-center font-semibold">{pct}%</div>
      </div>
      <div className="text-sm text-gray-500 mt-2">Points: {points}</div>
    </div>
  );
}
