// src/pages/dashboard/BadgesPage.jsx
import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";

const BACKEND = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function BadgesPage() {
  const { user: authUser, mongoUser } = useAuth();
  const [badgesDef, setBadgesDef] = useState([]);
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const email = (authUser?.email || mongoUser?.email || "").toLowerCase();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [defsRes, userRes] = await Promise.all([
          fetch(`${BACKEND}/badges`),
          email ? fetch(`${BACKEND}/badges/user?email=${encodeURIComponent(email)}`) : Promise.resolve({ ok: false })
        ]);
        const defsJson = defsRes.ok ? await defsRes.json() : null;
        const userJson = userRes.ok ? await userRes.json() : null;
        setBadgesDef((defsJson && defsJson.badges) || []);
        setUserStatus((userJson && userJson.userBadges) || null);
      } catch (err) {
        console.error("Badges load error", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [email]);

  const sessionsDone = userStatus?.sessionsDone ?? Number(mongoUser?.evaluationsCount || mongoUser?.sessionsCompleted || 0);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Badges & Achievements</h2>

      <div className="mb-6 bg-white p-4 rounded-2xl shadow">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">Earn badges by completing sessions, receiving positive peer reviews, and contributing to the community.</p>
          <div className="text-sm font-medium text-slate-800 bg-slate-100 px-3 py-1 rounded-full">
            Sessions: <span className="font-semibold ml-1">{sessionsDone}</span>
          </div>
        </div>
      </div>

      {loading ? <div className="bg-white p-6 rounded-2xl shadow">Loading...</div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {badgesDef.map((b) => {
            const earned = (userStatus?.earned || []).includes(b.id);
            const progress = userStatus ? Math.min(100, Math.round((userStatus.sessionsDone / Math.max(1, b.threshold || 1)) * 100)) : 0;
            const remaining = Math.max(0, (b.threshold || 0) - (userStatus?.sessionsDone || 0));
            return (
              <div key={b.id} className="bg-white rounded-2xl p-6 shadow">
                <div className="flex items-center gap-4">
                  <div className={`w-20 h-20 rounded-full grid place-items-center text-white font-bold ${b.color || "bg-slate-400"}`}>
                    {b.name.split(" ").map(n => n[0]).slice(0,2).join("")}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{b.name}</div>
                      {earned && <div className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700">Earned</div>}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{b.desc}</div>
                  </div>
                </div>

                {b.threshold > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>{userStatus?.sessionsDone ?? 0}/{b.threshold} sessions</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-700" style={{ width: `${progress}%` }} />
                    </div>
                    {!earned && remaining > 0 && <div className="text-xs text-gray-500 mt-2">{remaining} more sessions to unlock</div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
