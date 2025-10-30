// src/pages/dashboard/BadgesPage.jsx
import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Star } from "lucide-react";

const BACKEND = import.meta.env.VITE_API_URL || "http://localhost:5000";

// tiny keyframes for sparkle (kept in component style)
const sparkleStyle = `
@keyframes shimmer {
  0% { transform: translateY(0) scale(1); opacity: 0.9; }
  50% { transform: translateY(-6px) scale(1.02); opacity: 1; }
  100% { transform: translateY(0) scale(1); opacity: 0.9; }
}
`;

function TierStar({ tier = "bronze", size = 26 }) {
  const map = {
    gold: "#D4AF37",
    silver: "#C0C0C0",
    bronze: "#B87333",
  };
  const color = map[tier] || "#9CA3AF";
  return <Star size={size} style={{ color }} />;
}

export default function BadgesPage() {
  const { user: authUser } = useAuth();
  const email = (authUser?.email || "").toLowerCase();
  const [defs, setDefs] = useState([]);
  const [userBadges, setUserBadges] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const [defsRes, userRes] = await Promise.all([
          fetch(`${BACKEND}/badges`),
          email ? fetch(`${BACKEND}/badges/user?email=${encodeURIComponent(email)}`) : Promise.resolve(null),
        ]);
        const defsJson = defsRes.ok ? await defsRes.json() : { badges: [] };
        const userJson = userRes && userRes.ok ? await userRes.json() : null;
        if (!isMounted) return;
        setDefs(defsJson.badges || []);
        setUserBadges(userJson?.userBadges || null);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => (isMounted = false);
  }, [email]);

  const claim = async (badgeId) => {
    if (!email) return alert("Sign in to claim");
    setClaiming(badgeId);
    try {
      const res = await fetch(`${BACKEND}/badges/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, badgeId }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Claim failed");
      const ref = await fetch(`${BACKEND}/badges/user?email=${encodeURIComponent(email)}`);
      const rj = await ref.json();
      setUserBadges(rj.userBadges);
      alert("Badge claimed!");
    } catch (err) {
      alert(err.message || "Failed to claim");
    } finally {
      setClaiming(null);
    }
  };

  if (loading) return <div className="p-6">Loading badges...</div>;

  const sessionsDone = userBadges?.sessionsDone || 0;
  const earnedSet = new Set(userBadges?.earned || []);
  const storedSet = new Set(userBadges?.stored || []);

  return (
    <div className="p-6">
      <style>{sparkleStyle}</style>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">Badges</h2>
          <p className="text-sm text-slate-500 mt-1">Collect badges as you complete sessions and level up.</p>
        </div>
        <div className="text-sm text-slate-600">Sessions completed: <span className="font-semibold">{sessionsDone}</span></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {defs.map((b) => {
          const isEarned = earnedSet.has(b.id) || storedSet.has(b.id);
          const tier = b.tier || (b.threshold >= 40 ? "gold" : b.threshold >= 15 ? "silver" : "bronze");
          return (
            <div
              key={b.id}
              className={`rounded-2xl p-4 shadow-sm border ${isEarned ? "bg-white" : "bg-gradient-to-br from-white to-slate-50"} transform transition hover:-translate-y-1`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 rounded-lg grid place-items-center ${isEarned ? "bg-white" : "bg-[rgba(240,246,255,0.7)]"}`}>
                  <div style={{ animation: isEarned ? "shimmer 1.6s ease-in-out infinite" : "none" }}>
                    <TierStar tier={tier} size={36} />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-slate-800">{b.name}</div>
                    <div className={`text-xs px-2 py-0.5 rounded ${isEarned ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                      {isEarned ? "Earned" : "Locked"}
                    </div>
                  </div>
                  <div className="text-sm text-slate-500 mt-1">{b.desc}</div>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="text-xs text-slate-500">{sessionsDone}/{b.threshold} sessions</div>
                    <div className="flex-1">
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full"
                          style={{
                            width: `${Math.min(100, Math.round((sessionsDone / (b.threshold || 1)) * 100))}%`,
                            background: tier === "gold" ? "linear-gradient(90deg,#FDE68A,#F59E0B)" : tier === "silver" ? "linear-gradient(90deg,#E5E7EB,#9CA3AF)" : "linear-gradient(90deg,#FDECE6,#F5906F)"
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    {isEarned ? (
                      <button onClick={() => alert("Badge already in your profile")} className="px-3 py-1 rounded bg-indigo-600 text-white text-sm shadow-sm">View</button>
                    ) : (
                      <button disabled={claiming === b.id} onClick={() => claim(b.id)} className="px-3 py-1 rounded bg-emerald-500 text-white text-sm shadow-sm">
                        {claiming === b.id ? "Claiming..." : "Claim"}
                      </button>
                    )}

                    {!isEarned && (
                      <div className="text-xs text-slate-400">Need {Math.max(0, (b.threshold || 0) - sessionsDone)} more</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
