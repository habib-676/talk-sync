// src/components/dashboard/widgets/SuggestedPartners.jsx
import React from "react";
import { Link } from "react-router";

export default function SuggestedPartners({ partners = [], onRequest }) {
  if (!partners || partners.length === 0) {
    return <div className="text-sm text-gray-500">No suggestions yet.</div>;
  }

  return (
    <div className="space-y-3">
      {partners.map((p) => {
        const id = p._id || p.email;
        return (
          <div key={id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50">
            <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-lg font-semibold">
              {p.image ? <img src={p.image} alt={p.name || p.email} className="w-full h-full object-cover" /> : (p.name ? p.name[0].toUpperCase() : (p.email ? p.email[0].toUpperCase() : "?"))}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="truncate">
                  <div className="font-medium text-sm">{p.name || p.email}</div>
                  <div className="text-xs text-gray-500 truncate">{p.bio || (p.native_language ? `${p.native_language} • Learning ${p.learning_language?.join?.(", ") || "—"}` : p.email)}</div>
                </div>
                <div className="text-xs text-gray-400">{p.status || ""}</div>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 text-xs">Native: {p.native_language || "—"}</span>
                <span className="px-2 py-1 rounded bg-indigo-50 text-indigo-700 text-xs">Learning: {(p.learning_language && p.learning_language[0]) || "—"}</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <Link to={`/dashboard/profile?user=${encodeURIComponent(p.email)}`} className="text-xs text-indigo-600 hover:underline">View</Link>
              <button onClick={() => onRequest ? onRequest(p) : window.alert("Request callback not provided")} className="px-3 py-1 rounded-full bg-indigo-600 text-white text-sm">Request</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

