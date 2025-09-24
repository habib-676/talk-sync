import React from "react";
import { motion } from "framer-motion";

const STEPS = [
  {
    id: 1,
    title: "Create your profile",
    hint: "Photo • Languages • Availability",
    emoji: "🖼️",
    gradient: "bg-gradient-to-r from-pink-400 via-fuchsia-400 to-rose-400",
  },
  {
    id: 2,
    title: "Find a match",
    hint: "Smart pairing or tutor",
    emoji: "🔎",
    gradient: "bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400",
  },
  {
    id: 3,
    title: "Start a session",
    hint: "Video • Screen share • Prompts",
    emoji: "🎬",
    gradient: "bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-300",
  },
  {
    id: 4,
    title: "Reflect & grow",
    hint: "Feedback • Badges • Review",
    emoji: "🌱",
    gradient: "bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300",
  },
];

export default function HowItWorks() {
  return (
    <section className="maximum-w mx-auto px-4 py-14">
      <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-br from-white via-slate-50 to-white shadow-2xl ring-1 ring-gray-100">
        <div className="md:flex md:items-start md:justify-between gap-8">
          {/* Left: heading */}
          <div className="md:w-1/3">
            <h2 className="text-3xl md:text-4xl font-extrabold">
              How{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500">
                TalkSync
              </span>{" "}
              works
            </h2>
            <p className="mt-3 text-gray-600">
              Fast, friendly language practice — tap a card to explore. Hover a
              card to see playful highlights and gradient accents.
            </p>

            <div className="mt-5 flex gap-3">
              <a
                href="#signup"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-medium shadow-md hover:scale-[1.02] transform transition"
              >
                Get started
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Explore
              </a>
            </div>

            <ul className="mt-6 space-y-3 text-sm text-gray-600">
              <li>• Onboarding in 2 minutes</li>
              <li>• Secure, moderated sessions</li>
              <li>• Earn badges for progress</li>
            </ul>
          </div>

          {/* Right: grid of cards */}
          <div className="md:w-2/3 mt-6 md:mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {STEPS.map((s) => (
                <motion.button
                  key={s.id}
                  whileHover={{ translateY: -6 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative group text-left overflow-hidden rounded-xl p-4 bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all"
                  aria-label={s.title}
                >
                  <div className="flex items-start gap-4">
                    {/* emoji within a perfectly centered circle */}
                    <div
                      className={`flex-none w-14 h-14 rounded-lg grid place-items-center text-2xl shadow-inner ${s.gradient}`}
                      style={{ flexShrink: 0 }}
                    >
                      <div className="transform translate-y-[1px]">
                        {s.emoji}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold truncate">
                            {s.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 truncate">
                            {s.hint}
                          </p>
                        </div>

                        {/* Hover badge */}
                        <div className="opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all text-xs bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-2 py-1 rounded-full">
                          Try
                        </div>
                      </div>

                      {/* gradient progress */}
                      <div className="mt-4 h-2 rounded-full overflow-hidden bg-gray-100">
                        <div
                          className="h-2 rounded-full transition-all duration-400"
                          style={{
                            width: "60%",
                            background:
                              "linear-gradient(90deg, rgba(99,102,241,1), rgba(236,72,153,1))",
                          }}
                        />
                      </div>

                      {/* playful caption */}
                      <div className="mt-3 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {s.id === 1
                          ? "Profile setup takes 2 minutes — be yourself!"
                          : s.id === 2
                          ? "Filter by language, level, and time."
                          : s.id === 3
                          ? "Ensure mic & camera are enabled for best results."
                          : "Leave feedback to unlock badges."}
                      </div>
                    </div>
                  </div>

                  {/* soft radial highlight on hover */}
                  <span className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-white/0 to-white/30 opacity-0 group-hover:opacity-40 transition-opacity mix-blend-screen" />

                  {/* subtle corner accent */}
                  <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full opacity-10 bg-gradient-to-br from-indigo-400 to-pink-400 transform rotate-12 pointer-events-none" />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
