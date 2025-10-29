import React from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Brain,
  Clock,
  Users,
  TrendingUp,
  Award,
  Zap,
  Target,
} from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "Real-Time Communication",
    description:
      "Connect with native speakers instantly through live video, audio, and text chat for authentic practice.",
  },
  {
    icon: Brain,
    title: "Interactive Quizzes",
    description:
      "Reinforce learning with gamified quizzes and challenges that adapt to your skill level.",
  },
  {
    icon: Clock,
    title: "Learn on Your Schedule",
    description:
      "Study anytime, anywhere with flexible lessons that fit your lifestyle and pace.",
  },
  {
    icon: Target,
    title: "Personalized Learning",
    description:
      "AI-powered recommendations tailor your learning path based on goals and progress.",
  },
  {
    icon: Users,
    title: "Global Community",
    description:
      "Join millions of learners worldwide and make friends while practicing together.",
  },
  {
    icon: TrendingUp,
    title: "Track Your Progress",
    description:
      "Visualize your improvement with detailed analytics and achievement milestones.",
  },
  {
    icon: Zap,
    title: "Fast Progress",
    description:
      "Our proven methodology helps you achieve fluency 3x faster than traditional methods.",
  },
  {
    icon: Award,
    title: "Get Certified",
    description:
      "Earn recognized certificates to showcase your language proficiency to employers.",
  },
];

const WhyChooseTalkSync = () => {
  return (
    <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
      {/* Background Gradient Blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-indigo-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-indigo-400/30 to-blue-400/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              TalkSync
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Everything you need to grow your English skills effectively in one
            place.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>

      {/* Bottom Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-16 -mb-1 text-gray-100">
        <svg
          viewBox="0 0 1440 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 48h1440V24c-157.36 16-314.72 24-472.08 24C645.28 48 322.64 40 0 24v24z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
};

const FeatureCard = ({ feature, index }) => {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3 },
      }}
      className="group relative"
    >
      {/* Glassmorphism Card */}
      <div className="relative h-full p-6 rounded-2xl bg-white/60 backdrop-blur-xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300">
        {/* Gradient Border Glow on Hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/0 to-indigo-600/0 group-hover:from-blue-600/10 group-hover:to-indigo-600/10 transition-all duration-300 -z-10" />

        {/* Icon Container */}
        <div className="mb-4 relative">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all duration-300">
            <Icon className="w-7 h-7 text-white" strokeWidth={2} />
          </div>

          {/* Glow Effect */}
          <div className="absolute inset-0 w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">
            {feature.title}
          </h3>
          <p className="text-gray-600 text-sm">{feature.description}</p>
        </div>

        {/* Decorative Corner Element */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
};

export default WhyChooseTalkSync;
