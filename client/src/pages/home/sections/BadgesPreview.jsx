import React, { useMemo } from "react";

const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
const pct = (value, max) => clamp(Math.round((value / max) * 100), 0, 100);

export default function BadgesShowcaseFull({
  userName = "You",
  userPoints = 85,
  thresholds = { bronze: 10, silver: 50, gold: 200 },
}) {
  const badges = useMemo(() => ([
    { id: "bronze", title: "Bronze", colorFrom: "#C18B4C", colorTo: "#D6A15A", icon: "🥉", threshold: thresholds.bronze, desc: "Complete 10 meaningful sessions" },
    { id: "silver", title: "Silver", colorFrom: "#9CA3FF", colorTo: "#6D28D9", icon: "🥈", threshold: thresholds.silver, desc: "Earn positive feedback & 50 sessions" },
    { id: "gold", title: "Gold", colorFrom: "#FFD66B", colorTo: "#F59E0B", icon: "🥇", threshold: thresholds.gold, desc: "Mastery: 200 sessions + top ratings" },
  ]), [thresholds]);

  // compute progress per badge
  const badgeProgress = badges.map(b => {
    const percent = pct(userPoints, b.threshold);
    const unlocked = userPoints >= b.threshold;
    return { ...b, percent, unlocked };
  });


  return (
    <section className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* header */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold">Badges & Gamification — Level up as you speak</h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">Badges celebrate consistent practice — they’re visual milestones that motivate learners. Scroll to explore how to earn them and where you stand.</p>
        </header>

        {/* Hero: large badges row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-stretch">
          {badgeProgress.map((b, i) => {
            const ringSize = 160;
            const radius = (ringSize - 18) / 2;
            const circumference = 2 * Math.PI * radius;
            const dashoffset = circumference - (b.percent / 100) * circumference;
            return (
              <article key={b.id} className={`relative rounded-2xl p-6 bg-white shadow-xl border ${b.unlocked ? "border-green-50" : "border-gray-100"} overflow-hidden`}>
                {/* floating decorative sparkles */}
                <div className="pointer-events-none absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10 bg-gradient-to-br from-indigo-400 to-pink-400 transform rotate-12" />
                <div className="flex items-center gap-6">
                  <div style={{ width: ringSize }} className="relative flex-shrink-0">
                    <svg width={ringSize} height={ringSize} viewBox={`0 0 ${ringSize} ${ringSize}`} aria-hidden>
                      <circle cx={ringSize/2} cy={ringSize/2} r={radius} stroke="#F3F4F6" strokeWidth="14" fill="transparent" />
                      <circle cx={ringSize/2} cy={ringSize/2} r={radius}
                        stroke={`url(#g-${b.id})`} strokeWidth="14" strokeLinecap="round" fill="transparent"
                        strokeDasharray={circumference} strokeDashoffset={dashoffset}
                        transform={`rotate(-90 ${ringSize/2} ${ringSize/2})`}
                        style={{ transition: "stroke-dashoffset 1100ms cubic-bezier(.22,.9,.3,1)" }} />
                      <defs>
                        <linearGradient id={`g-${b.id}`} x1="0" x2="1">
                          <stop offset="0%" stopColor={b.colorFrom} />
                          <stop offset="100%" stopColor={b.colorTo} />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="absolute inset-0 grid place-items-center">
                      <div className={`w-20 h-20 rounded-full grid place-items-center text-4xl`} style={{ background: "white" }}>
                        <span>{b.icon}</span>
                      </div>
                    </div>

                    {b.unlocked && <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-green-400 ring-2 ring-white animate-ping-slower" />}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{b.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{b.desc}</p>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div>{b.unlocked ? "Unlocked" : `${b.percent}% to unlock`}</div>
                        <div className="font-semibold text-sm">{Math.min(userPoints, b.threshold)}/{b.threshold} pts</div>
                      </div>

                      <div className="mt-2 w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                        <div className="h-3 rounded-full" style={{ width: `${b.percent}%`, background: `linear-gradient(90deg, ${b.colorFrom}, ${b.colorTo})`, transition: "width 900ms cubic-bezier(.22,.9,.3,1)" }} />
                      </div>

                      <div className="mt-3 flex gap-2">
                        {b.unlocked ? (
                          <button className="px-3 py-1 text-sm rounded-full bg-green-50 text-green-700 font-semibold">View reward</button>
                        ) : (
                          <button onClick={() => alert(`You need ${b.threshold - userPoints} more points for ${b.title}`)} className="px-3 py-1 text-sm rounded-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold">How to get it</button>
                        )}
                        <button onClick={() => alert('Open practice modal (placeholder)')} className="px-3 py-1 text-sm rounded-full border border-gray-200 text-gray-700">Practice now</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expandable detail area (static here) */}
                <div className="mt-6 text-xs text-gray-500">
                  {b.id === "bronze" && <span>Bronze badges reward consistent beginners — each counted session must be at least 10 minutes and with positive rating.</span>}
                  {b.id === "silver" && <span>Silver requires commitment and quality: more sessions and positive feedback from partners.</span>}
                  {b.id === "gold" && <span>Gold badges indicate mastery — long-term consistent practice and high-rated contributions.</span>}
                </div>
              </article>
            );
          })}
        </div>


        {/* CTA + tips */}
        <div className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold">Ready to unlock your next badge?</h3>
            <p className="mt-1 text-sm opacity-90">Practice 3 sessions this week and get closer to Bronze.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => alert('Start a practice session (placeholder)')} className="px-5 py-3 rounded-full bg-white text-indigo-600 font-semibold shadow">Start practice</button>
            <button onClick={() => alert('Open challenges (placeholder)')} className="px-4 py-3 rounded-full border border-white/30 text-white font-medium">View challenges</button>
          </div>
        </div>

        {/* footer note */}
        <div className="mt-8 text-xs text-gray-400 text-center">
          Tip: Sessions count only when participants stay connected for at least 10 minutes. Repeated short sessions won't be counted to prevent gaming.
        </div>
      </div>
    </section>
  );
}
