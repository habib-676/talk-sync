// src/components/dashboard/widgets/SuggestedPartners.jsx
import React from "react";

export default function SuggestedPartners({ partners = [] }) {
  if (!partners.length) return <div className="text-sm text-gray-500">No suggestions yet.</div>;
  return (
    <div className="space-y-2">
      {partners.map((p) => (
        <div key={p.email} className="flex items-center gap-3 p-2 rounded hover:bg-slate-50">
          <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
            {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <div className="grid place-items-center text-sm">{(p.name || p.email)[0]}</div>}
          </div>
          <div className="flex-1">
            <div className="font-medium text-sm">{p.name || p.email}</div>
            <div className="text-xs text-gray-500">Native: {p.native_language || "—"}</div>
          </div>
          <div>
            <a href={`/users/${p.email}`} className="text-xs px-2 py-1 rounded-md border">View</a>
          </div>
        </div>
      ))}
    </div>
  );
}
