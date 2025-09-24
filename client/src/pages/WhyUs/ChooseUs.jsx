
import React from "react";
import {
  FaComments,
  FaQuestionCircle,
  FaClock,
  FaUserGraduate,
  FaUsers,
  FaChartLine,
  FaRocket,
  FaAward,
} from "react-icons/fa";
import { motion } from "framer-motion";

const features = [
  {
    icon: <FaComments />,
    title: "Face-to-Face Communication",
    description:
      "Live 1-on-1 and group sessions where learners practice real conversations and build confidence.",
  },
  {
    icon: <FaQuestionCircle />,
    title: "Interactive Quizzes",
    description:
      "Review lessons with fun quizzes after each session and track your improvement.",
  },
  {
    icon: <FaClock />,
    title: "Flexible Learning",
    description:
      "Book classes 24/7 and learn at your convenience from anywhere in the world.",
  },
  {
    icon: <FaUserGraduate />,
    title: "Personalized Learning Plan",
    description:
      "Get a custom plan based on your skill level and personal goals.",
  },
  {
    icon: <FaUsers />,
    title: "Community & Peer Practice",
    description:
      "Join active student forums and practice groups to grow together.",
  },
  {
    icon: <FaChartLine />,
    title: "Progress Tracking Dashboard",
    description:
      "Track your history, quiz results, and progress with a clear dashboard.",
  },
  {
    icon: <FaRocket />,
    title: "Fast Progress",
    description:
      "Accelerate your learning with interactive lessons and daily challenges.",
  },
  {
    icon: <FaAward />,
    title: "Certification",
    description:
      "Earn official certificates when you complete courses and milestones.",
  },
];

const ChooseUs = () => {
  return (
    <section className="py-15  relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute -top-10 -left-10 w-96 h-96  rounded-full filter blur-3xl opacity-30 animate-pulse -z-10"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full filter blur-3xl opacity-30 animate-pulse -z-10"></div>

      <div className="container mx-auto px-6 text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extrabold mb-6 "
        >
          Why Choose{" "}
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            TalkSync
          </span>
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className=" mb-20 max-w-3xl mx-auto text-lg leading-relaxed"
        >
          Everything you need to grow your English skills effectively in one
          place: live practice, interactive quizzes, personalized learning,
          community support, and certificates.
        </motion.p>

        {/* Single Card with 4-column grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative bg-white/90 backdrop-blur-lg border border-gray-200 rounded-3xl shadow-2xl p-10 max-w-7xl mx-auto text-left"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-4 transition-transform duration-300 hover:scale-105"
              >
                <div className="mb-4 flex items-center justify-center p-4 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-3xl shadow-md">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ChooseUs;
