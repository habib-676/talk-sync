import React, { useMemo } from "react";

const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
const pct = (value, max) => clamp(Math.round((value / max) * 100), 0, 100);

export default function BadgesPreview({
  userName = "You",
  userPoints = 85,
  thresholds = { bronze: 10, silver: 50, gold: 200 },
}) {
  const badges = useMemo(
    () => [
      {
        id: "bronze",
        title: "Bronze",
        colorFrom: "#2563EB", 
        colorTo: "#4F46E5", 
        icon: "🥉",
        threshold: thresholds.bronze,
        desc: "Complete 10 meaningful sessions",
      },
      {
        id: "silver",
        title: "Silver",
        colorFrom: "#60A5FA",
        colorTo: "#818CF8",
        icon: "🥈",
        threshold: thresholds.silver,
        desc: "Earn positive feedback & 50 sessions",
      },
      {
        id: "gold",
        title: "Gold",
        colorFrom: "#FACC15", 
        colorTo: "#FBBF24",
        icon: "🥇",
        threshold: thresholds.gold,
        desc: "Mastery: 200 sessions + top ratings",
      },
    ],
    [thresholds]
  );

  // compute progress per badge
  const badgeProgress = badges.map((b) => {
    const percent = pct(userPoints, b.threshold);
    const unlocked = userPoints >= b.threshold;
    return { ...b, percent, unlocked };
  });

  return (
    <section className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white py-12 md:py-16">
      <div className="maximum-w mx-auto px-4 sm:px-6 lg:px-8">
        {/* header */}
        <header className="mb-8 md:mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-4xl font-bold text-gray-900 leading-tight">
            Badges & Gamification — Level up as you speak
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
            Badges celebrate consistent practice — they’re visual milestones
            that motivate learners. Scroll to explore how to earn them and where
            you stand.
          </p>
        </header>

        {/* Hero: large badges row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 items-stretch">
          {badgeProgress.map((b, i) => {
            const ringSize = 160;
            const radius = (ringSize - 18) / 2;
            const circumference = 2 * Math.PI * radius;
            const dashoffset =
              circumference - (b.percent / 100) * circumference;
            return (
              <article
                key={b.id}
                className={`relative rounded-2xl p-6 bg-white shadow-xl border
                  ${b.unlocked ? "border-green-100" : "border-gray-100"}
                  hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out
                  overflow-hidden
                `}
              >
                {/* floating decorative sparkles */}
                <div className="pointer-events-none absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10 bg-gradient-to-br from-blue-400 to-indigo-400 transform rotate-12" />{" "}
                {/* Primary gradient applied */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  {" "}
                  {/* Responsive flex */}
                  <div
                    style={{ width: ringSize }}
                    className="relative flex-shrink-0 mb-4 sm:mb-0"
                  >
                    <svg
                      width={ringSize}
                      height={ringSize}
                      viewBox={`0 0 ${ringSize} ${ringSize}`}
                      aria-hidden
                    >
                      <circle
                        cx={ringSize / 2}
                        cy={ringSize / 2}
                        r={radius}
                        stroke="#E5E7EB"
                        strokeWidth="14"
                        fill="transparent"
                      />
                      <circle
                        cx={ringSize / 2}
                        cy={ringSize / 2}
                        r={radius}
                        stroke={`url(#g-${b.id})`}
                        strokeWidth="14"
                        strokeLinecap="round"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashoffset}
                        transform={`rotate(-90 ${ringSize / 2} ${
                          ringSize / 2
                        })`}
                        style={{
                          transition:
                            "stroke-dashoffset 1100ms cubic-bezier(.22,.9,.3,1)",
                        }}
                      />
                      <defs>
                        <linearGradient
                          id={`g-${b.id}`}
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="0"
                        >
                          {" "}
                          {/* Horizontal gradient for ring */}
                          <stop offset="0%" stopColor={b.colorFrom} />
                          <stop offset="100%" stopColor={b.colorTo} />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="absolute inset-0 grid place-items-center">
                      <div
                        className={`w-20 h-20 rounded-full grid place-items-center text-4xl shadow-md`}
                        style={{ background: "white" }}
                      >
                        <span>{b.icon}</span>
                      </div>
                    </div>

                    {b.unlocked && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-green-400 ring-2 ring-white animate-ping-slower" />
                    )}
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    {" "}
                    {/* Responsive text alignment */}
                    <h3 className="text-xl font-semibold text-gray-800">
                      {b.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{b.desc}</p>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div>
                          {b.unlocked ? "Unlocked" : `${b.percent}% to unlock`}
                        </div>
                        <div className="font-semibold text-sm">
                          {Math.min(userPoints, b.threshold)}/{b.threshold} pts
                        </div>
                      </div>

                      <div className="mt-2 w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                        <div
                          className="h-3 rounded-full"
                          style={{
                            width: `${b.percent}%`,
                            background: `linear-gradient(90deg, ${b.colorFrom}, ${b.colorTo})`,
                            transition: "width 900ms cubic-bezier(.22,.9,.3,1)",
                          }}
                        />
                      </div>

                      <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
                        {" "}
                        {/* Responsive button layout */}
                        {b.unlocked ? (
                          <button className="px-3 py-1 text-sm rounded-full bg-green-50 text-green-700 font-semibold hover:bg-green-100 transition-colors">
                            View reward
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              alert(
                                `You need ${
                                  b.threshold - userPoints
                                } more points for ${b.title}`
                              )
                            }
                            className="px-3 py-1 text-sm rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-sm hover:shadow-md transition-all"
                          >
                            How to get it
                          </button>
                        )}
                        <button
                          onClick={() =>
                            alert("Open practice modal (placeholder)")
                          }
                          className="px-3 py-1 text-sm rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Practice now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Expandable detail area (static here) */}
                <div className="mt-6 text-xs text-gray-500 text-center sm:text-left">
                  {" "}
                  {/* Responsive text alignment */}
                  {b.id === "bronze" && (
                    <span>
                      Bronze badges reward consistent beginners — each counted
                      session must be at least 10 minutes and with positive
                      rating.
                    </span>
                  )}
                  {b.id === "silver" && (
                    <span>
                      Silver requires commitment and quality: more sessions and
                      positive feedback from partners.
                    </span>
                  )}
                  {b.id === "gold" && (
                    <span>
                      Gold badges indicate mastery — long-term consistent
                      practice and high-rated contributions.
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* CTA + tips */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          {" "}
          <div>
            <h3 className="text-xl sm:text-2xl font-bold">
              Ready to unlock your next badge?
            </h3>
            <p className="mt-1 text-sm opacity-90">
              Practice 3 sessions this week and get closer to Bronze.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {" "}
            {/* Responsive button layout */}
            <button
              onClick={() => alert("Start a practice session (placeholder)")}
              className="px-5 py-3 rounded-full bg-white text-blue-600 font-semibold shadow hover:bg-gray-100 transition-colors"
            >
              Start practice
            </button>
            <button
              onClick={() => alert("Open challenges (placeholder)")}
              className="px-4 py-3 rounded-full border border-white/30 text-white font-medium hover:bg-white/10 transition-colors"
            >
              View challenges
            </button>
          </div>
        </div>

        {/* footer note */}
        <div className="mt-8 text-xs text-gray-400 text-center">
          Tip: Sessions count only when participants stay connected for at least
          10 minutes. Repeated short sessions won't be counted to prevent
          gaming.
        </div>
      </div>
    </section>
  );
}
