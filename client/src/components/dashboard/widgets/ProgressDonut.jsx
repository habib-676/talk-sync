// src/components/dashboard/widgets/ProgressDonut.jsx
import React from "react";

export default function ProgressDonut({ points = 0, targetPoints = 200, size = 112 }) {
  const pct = Math.max(0, Math.min(100, Math.round((points / Math.max(1, targetPoints)) * 100)));
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const stroke = 10;
  const dash = (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} aria-hidden>
        <g transform={`translate(${size/2},${size/2})`}>
          <circle r={radius} fill="transparent" stroke="#eef2ff" strokeWidth={stroke} />
          <circle
            r={radius}
            fill="transparent"
            stroke="#7c3aed"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference - dash}`}
            transform="rotate(-90)"
          />
        </g>
      </svg>
      <div className="mt-2 text-sm font-semibold text-slate-800">{pct}%</div>
      <div className="text-xs text-gray-500">{points}/{targetPoints} pts</div>
    </div>
  );
}

