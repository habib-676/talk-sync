// src/components/dashboard/widgets/NextSessionCard.jsx
import React from "react";
import { Link } from "react-router";
import useCountdown from "../../../hooks/useCountdown";
import { Clock } from "lucide-react";

export default function NextSessionCard({ nextSession, onDetails, onJoin, showFeedbackLink = true }) {
  if (!nextSession) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-slate-100"><Clock/></div>
          <div>
            <h3 className="text-lg font-semibold">Next session</h3>
            <p className="text-sm text-gray-500 mt-2">No upcoming sessions. Book a session to get started.</p>
          </div>
        </div>
      </div>
    );
  }

  const timeISO = nextSession.scheduledAt || nextSession.startTime || nextSession.createdAt || null;
  const when = timeISO ? new Date(timeISO) : null;
  const timeStr = when ? when.toLocaleString() : "TBD";
  const { days, hours, minutes, seconds, expired } = useCountdown(timeISO);
  const sessionId = nextSession._id || nextSession.sessionId || null;
  const joinUrl = nextSession.joinUrl || (sessionId ? `/meet?session=${encodeURIComponent(sessionId)}` : null);

  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-slate-50 text-slate-700"><Clock/></div>

          <div>
            <h3 className="text-lg font-semibold">Next session</h3>
            <div className="text-sm text-gray-600 mt-1">{nextSession.title || "Practice session"}</div>
            <div className="text-sm text-slate-700 mt-2">When: <span className="font-medium">{timeStr}</span></div>
            <div className="text-sm text-slate-700 mt-1">With: <span className="font-medium">{nextSession.partnerName || nextSession.partner || nextSession.partnerEmail || "Partner"}</span></div>

            {timeISO && !expired && (
              <div className="mt-3 text-xs text-gray-600">
                Starts in <span className="font-medium">{days}d {hours}h {minutes}m {seconds}s</span>
              </div>
            )}
            {timeISO && expired && <div className="mt-3 text-xs text-amber-600">Starting now or in progress</div>}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {joinUrl ? (
            joinUrl.startsWith("/") ? (
              <Link to={joinUrl} className="px-3 py-2 rounded-full bg-indigo-600 text-white text-sm">Join</Link>
            ) : (
              <a href={joinUrl} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-full bg-indigo-600 text-white text-sm">Join</a>
            )
          ) : (
            <button onClick={() => onJoin && onJoin(nextSession)} className="px-3 py-2 rounded-full border text-sm">Join</button>
          )}

          <button onClick={() => onDetails && onDetails(nextSession)} className="px-3 py-2 rounded-full border text-sm">Details</button>

          {showFeedbackLink && sessionId && (nextSession.status === "accepted" || nextSession.status === "completed") && (
            <Link to={`/dashboard/feedback/${encodeURIComponent(sessionId)}`} className="text-xs text-indigo-600 mt-1 hover:underline">Give feedback</Link>
          )}
        </div>
      </div>
    </div>
  );
}

