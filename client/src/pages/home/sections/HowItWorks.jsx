import React from 'react';
import { motion } from 'framer-motion';

export const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: 'Create your profile',
      desc: 'Upload a photo, set your native & target languages, and pick availability.',
    },
    {
      id: 2,
      title: 'Find a match',
      desc: 'Smart matching pairs you with partners by language, level & time — or pick a tutor for paid lessons.',
    },
    {
      id: 3,
      title: 'Start a session',
      desc: 'One-on-one or small group video/audio with guided prompts and screen sharing.',
    },
    {
      id: 4,
      title: 'Give & Grow',
      desc: 'Rate sessions, earn badges, and track progress — keep improving every week.',
    },
  ];

  return (
    <section className="bg-gradient-to-r from-white via-sky-50 to-white rounded-2xl p-8 shadow-lg">
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        <div className="lg:w-5/12">
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-extrabold leading-tight"
          >
            How <span className="text-indigo-600">TalkSync</span> Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-4 text-gray-600"
          >
            Quick, guided language practice with real people — schedule, join, and learn. Earn
            badges and build confidence with every session.
          </motion.p>

          <div className="mt-6 grid grid-cols-1 gap-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 * i, duration: 0.5 }}
                className="flex items-start gap-4 bg-white/70 p-4 rounded-xl shadow-sm ring-1 ring-gray-100"
              >
                <div className="flex-none text-indigo-600">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 grid place-items-center">{s.id}</div>
                </div>
                <div>
                  <h4 className="font-semibold">{s.title}</h4>
                  <p className="text-sm text-gray-500">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <a
              href="#"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-600 text-white font-medium shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              Get Started
            </a>
          </div>
        </div>

        <div className="lg:w-7/12 flex justify-center">
          <motion.div
            initial={{ scale: 0.98, y: 8 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative w-full max-w-md"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-100">
              <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <div className="text-sm font-semibold">Live Session</div>
                    <div className="text-xs opacity-90">Spanish • Intermediate</div>
                  </div>
                  <div className="text-xs">⏱ 25m</div>
                </div>
              </div>
              <div className="bg-white p-4">
                <div className="h-40 bg-gray-50 rounded-md flex items-center justify-center text-gray-400">
                  Video Stream Mock
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1545996124-54f1c6cf6d5b?w=60&h=60&fit=crop" alt="avatar" className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm" />
                    <div>
                      <div className="font-medium">You</div>
                      <div className="text-sm text-gray-500">Partner: Carlos</div>
                    </div>
                  </div>
                  <div className="inline-flex gap-2">
                    <button className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-sm">Leave</button>
                    <button className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-sm">Mute</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 left-6 bg-white/90 px-3 py-1 rounded-full shadow-md text-xs ring-1 ring-gray-100">Guided prompts • Screen share</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
