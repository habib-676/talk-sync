import React, { useMemo } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";

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

  const badgeProgress = badges.map((b) => {
    const percent = pct(userPoints, b.threshold);
    const unlocked = userPoints >= b.threshold;
    return { ...b, percent, unlocked };
  });

  // animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    hover: {
      scale: 1.03,
      boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white py-12 md:py-16"
    >
      <div className="maximum-w mx-auto px-4 sm:px-6 lg:px-8">
        {/* header */}
        <header className="mb-8 md:mb-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-4xl font-bold text-gray-900 leading-tight"
          >
            Badges & Gamification — Level up as you speak
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-3 text-gray-600 max-w-2xl mx-auto text-base sm:text-lg"
          >
            Badges celebrate consistent practice — they’re visual milestones
            that motivate learners. Scroll to explore how to earn them and where
            you stand.
          </motion.p>
        </header>

        {/* Hero: large badges row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 items-stretch"
        >
          {badgeProgress.map((b) => {
            const ringSize = 160;
            const radius = (ringSize - 18) / 2;
            const circumference = 2 * Math.PI * radius;
            const dashoffset =
              circumference - (b.percent / 100) * circumference;
            return (
              <motion.article
                key={b.id}
                variants={cardVariants}
                whileHover="hover"
                className={`relative rounded-2xl p-6 bg-white shadow-xl border
                  ${b.unlocked ? "border-green-100" : "border-gray-100"}
                  transition-all duration-300 ease-in-out overflow-hidden
                `}
              >
                {/* floating sparkles */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 0.1, scale: 1 }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                  className="pointer-events-none absolute -right-8 -top-8 w-40 h-40 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 rotate-12"
                />
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
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
                      <motion.circle
                        cx={ringSize / 2}
                        cy={ringSize / 2}
                        r={radius}
                        stroke={`url(#g-${b.id})`}
                        strokeWidth="14"
                        strokeLinecap="round"
                        fill="transparent"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        whileInView={{
                          strokeDashoffset: dashoffset,
                        }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 1.1,
                          ease: [0.22, 0.9, 0.3, 1],
                        }}
                        transform={`rotate(-90 ${ringSize / 2} ${
                          ringSize / 2
                        })`}
                      />
                      <defs>
                        <linearGradient
                          id={`g-${b.id}`}
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="0"
                        >
                          <stop offset="0%" stopColor={b.colorFrom} />
                          <stop offset="100%" stopColor={b.colorTo} />
                        </linearGradient>
                      </defs>
                    </svg>

                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="absolute inset-0 grid place-items-center"
                    >
                      <div className="w-20 h-20 rounded-full grid place-items-center text-4xl shadow-md bg-white">
                        <span>{b.icon}</span>
                      </div>
                    </motion.div>

                    {b.unlocked && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-green-400 ring-2 ring-white animate-pulse"
                      />
                    )}
                  </div>

                  {/* badge text + progress */}
                  <div className="flex-1 text-center sm:text-left">
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

                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${b.percent}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.9,
                          ease: [0.22, 0.9, 0.3, 1],
                        }}
                        className="mt-2 h-3 rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${b.colorFrom}, ${b.colorTo})`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        {/* CTA section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left"
        >
          <div>
            <h3 className="text-xl sm:text-2xl font-bold">
              Ready to unlock your next badge?
            </h3>
            <p className="mt-1 text-sm opacity-90">
              Practice 3 sessions this week and get closer to Bronze.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/dashboard/follow"
              className="px-5 py-3 rounded-full bg-white text-blue-600 font-semibold shadow hover:bg-gray-100 transition-colors"
            >
              Start practice
            </Link>
            <Link
              to="/dashboard/quizzes"
              className="px-4 py-3 rounded-full border border-white/30 text-white font-medium hover:bg-white/10 transition-colors"
            >
              View challenges
            </Link>
          </div>
        </motion.div>

        <div className="mt-8 text-xs text-gray-400 text-center">
          Tip: Sessions count only when participants stay connected for at least
          10 minutes. Repeated short sessions won't be counted to prevent
          gaming.
        </div>
      </div>
    </motion.section>
  );
}
