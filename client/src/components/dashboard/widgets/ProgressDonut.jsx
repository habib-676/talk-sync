// src/components/dashboard/widgets/ProgressDonut.jsx
import React from "react";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

export default function ProgressDonut({ sessionsCompleted = 0, totalSessions = 40, size = 112 }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const stroke = 10;

  // Clamp progress percentage
  const pct = Math.min(100, Math.round((sessionsCompleted / totalSessions) * 100));
  const dash = (pct / 100) * circumference;

  const controls = useAnimation();

  useEffect(() => {
    controls.start({ dashoffset: circumference - dash });
  }, [dash, circumference, controls]);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} aria-hidden>
        <g transform={`translate(${size / 2},${size / 2})`}>
          {/* Background circle */}
          <circle r={radius} fill="transparent" stroke="#e5e7eb" strokeWidth={stroke} />
          {/* Animated progress */}
          <motion.circle
            r={radius}
            fill="transparent"
            stroke="#7c3aed"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            animate={controls}
            initial={{ dashoffset: circumference }}
            style={{ rotate: -90, transformOrigin: "50% 50%" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </g>
      </svg>
      <div className="mt-2 text-sm font-semibold text-slate-800">{pct}%</div>
      <div className="text-xs text-gray-500">{sessionsCompleted}/{totalSessions} sessions</div>
    </div>
  );
}


