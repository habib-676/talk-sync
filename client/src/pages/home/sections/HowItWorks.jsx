import React from "react";
import {
  User,
  Heart,
  MessageSquare,
  Star,
  ArrowUpRight,
  Check,
} from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Create your profile",
      description: "Photo • Languages • Availability",
      progress: 25,
      icon: User,
    },
    {
      id: 2,
      title: "Find a match",
      description: "Smart pairing or tutor",
      progress: 50,
      icon: Heart,
    },
    {
      id: 3,
      title: "Start a session",
      description: "Video • Screen share • Prompts",
      progress: 75,
      icon: MessageSquare,
    },
    {
      id: 4,
      title: "Reflect & grow",
      description: "Feedback • Badges • Review",
      progress: 100,
      icon: Star,
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const leftContentVariants = {
    hidden: {
      opacity: 0,
      x: -50,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8,
      },
    },
  };

  const stepCardVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6,
      },
    },
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  };

  const progressBarVariants = {
    hidden: {
      width: 0,
    },
    visible: {
      width: "100%",
      transition: {
        duration: 1.5,
        ease: "easeOut",
        delay: 0.5,
      },
    },
  };

  const buttonVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        duration: 0.6,
      },
    },
    hover: {
      scale: 1.05,
      y: -2,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.98,
      y: 0,
    },
  };

  const statVariants = {
    hidden: {
      opacity: 0,
      scale: 0.5,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 12,
      },
    },
    hover: {
      scale: 1.1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 8,
      },
    },
  };

  const iconVariants = {
    hidden: {
      scale: 0,
      rotate: -180,
    },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 12,
        duration: 0.8,
      },
    },
    hover: {
      scale: 1.2,
      rotate: 360,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 8,
      },
    },
  };

  const numberCircleVariants = {
    hidden: {
      scale: 0,
      rotate: -180,
    },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        duration: 0.6,
      },
    },
    hover: {
      scale: 1.1,
      rotate: 360,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10,
      },
    },
  };

  return (
    <motion.section
      id="howItsWork"
      className="min-h-screen bg-gray-50 text-gray-900 p-8 relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      {/* Background Gradient for the entire page for better glassmorphism contrast */}
      <motion.div
        className="absolute inset-0 z-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 100%)",
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.3 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
      ></motion.div>

      <motion.div
        className="absolute inset-0 z-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 90% 80%, rgba(16, 185, 129, 0.1) 0%, rgba(245, 158, 11, 0.1) 50%, transparent 100%)",
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.3 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.5 }}
      ></motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        {/* Left Section */}
        <motion.div
          className="flex flex-col justify-center"
          variants={leftContentVariants}
        >
          <motion.div
            className="flex items-center text-blue-600 mb-4"
            variants={leftContentVariants}
          >
            <motion.span variants={iconVariants} whileHover="hover">
              <Check size={16} className="mr-2" />
            </motion.span>
            <span className="text-sm font-medium">How It Works</span>
          </motion.div>

          <motion.h1
            className="text-5xl font-bold mb-6 leading-tight"
            variants={leftContentVariants}
          >
            Your journey to{" "}
            <motion.span
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text"
              initial={{ backgroundPosition: "0% 50%" }}
              whileInView={{ backgroundPosition: "100% 50%" }}
              viewport={{ once: true }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{
                backgroundSize: "200% 200%",
              }}
            >
              fluency
            </motion.span>{" "}
            starts here
          </motion.h1>

          <motion.p
            className="text-gray-600 text-lg mb-8 max-w-md"
            variants={leftContentVariants}
          >
            Master any language through AI-powered conversations and real
            partner connections. Four simple steps to transform your language
            learning experience.
          </motion.p>

          <motion.div
            className="flex flex-col md:flex-row gap-5 mb-12"
            variants={containerVariants}
          >
            <Link to={"/auth/register"}>
              <motion.button
                className="flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition duration-300 shadow-md hover:shadow-lg"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Get started free
                <motion.span
                  whileHover={{ x: 5, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <ArrowUpRight size={18} className="ml-2" />
                </motion.span>
              </motion.button>
            </Link>

            <motion.button
              className="flex items-center px-6 py-3 rounded-full border border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900 transition duration-300 bg-white shadow-sm hover:shadow-md"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <motion.span
                className="w-3 h-3 bg-red-500 rounded-full mr-2"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              ></motion.span>
              Watch demo
            </motion.button>
          </motion.div>

          <motion.div className="flex space-x-8" variants={containerVariants}>
            {[
              { value: "50K+", label: "Active learners" },
              { value: "30+", label: "Languages" },
              { value: "4.9", label: "Average rating", icon: Star },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={statVariants}
                whileHover="hover"
                transition={{ delay: index * 0.1 }}
              >
                <p className="text-3xl font-bold text-gray-900 flex items-center">
                  {stat.value}
                  {stat.icon && (
                    <motion.span variants={iconVariants} whileHover="hover">
                      <Star
                        fill="currentColor"
                        stroke="none"
                        className="ml-1 text-yellow-500 w-6 h-6"
                      />
                    </motion.span>
                  )}
                </p>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Section - Steps */}
        <motion.div className="space-y-6" variants={containerVariants}>
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className={`p-6 rounded-2xl shadow-md relative overflow-hidden group
                ${
                  step.progress === 100
                    ? "bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200"
                    : "bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200"
                }
              `}
              style={{
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
              variants={stepCardVariants}
              whileHover="hover"
              transition={{ delay: index * 0.2 }}
            >
              {/* Hover gradient background */}
              <motion.div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 rounded-2xl
                  ${
                    step.progress === 100
                      ? "bg-gradient-to-br from-indigo-50 to-purple-50"
                      : "bg-gradient-to-br from-blue-50 to-indigo-50"
                  }
                `}
                style={{
                  zIndex: -1,
                }}
                whileHover={{ opacity: 1 }}
              ></motion.div>

              {/* Decorative elements */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: `radial-gradient(circle at top right, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`,
                  zIndex: 0,
                }}
              ></div>

              <motion.div
                className="absolute top-4 right-4 text-blue-400 opacity-20"
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                {React.createElement(step.icon, { size: 48 })}
              </motion.div>

              <div className="flex items-center mb-4 relative z-10">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 shadow-sm
                    ${step.progress === 100 ? "bg-indigo-500" : "bg-blue-500"}
                  `}
                  variants={numberCircleVariants}
                  whileHover="hover"
                >
                  {step.id}
                </motion.div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 relative z-10 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full shadow-sm ${
                    step.progress === 100
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                      : "bg-gradient-to-r from-blue-500 to-indigo-500"
                  }`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${step.progress}%` }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1.5,
                    delay: 0.5 + index * 0.2,
                    ease: "easeOut",
                  }}
                ></motion.div>
              </div>

              <p className="text-right text-gray-600 text-sm mt-2 relative z-10">
                Step {step.id} of 4
              </p>
            </motion.div>
          ))}

          <motion.button
            className="flex items-center justify-center w-full py-4 rounded-xl bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 transition duration-300 mt-6 relative z-10 shadow-sm hover:shadow-md"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <motion.span variants={iconVariants} whileHover="hover">
              <Check size={18} className="mr-2" />
            </motion.span>
            Complete all steps to unlock premium features
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HowItWorks;
