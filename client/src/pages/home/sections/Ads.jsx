import { Settings, Users } from "lucide-react";
import React from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";

const Ads = () => {
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

  const textVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8,
      },
    },
  };

  const buttonVariants = {
    hidden: {
      opacity: 0,
      y: 30,
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

  const imageVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      x: 100,
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        duration: 1,
      },
    },
  };

  const floatingCardVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 12,
        duration: 0.8,
        delay: 1,
      },
    },
    hover: {
      y: -10,
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  };

  const trustIndicatorVariants = {
    hidden: {
      opacity: 0,
      x: -20,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const backgroundCircleVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
    },
    visible: {
      scale: 1,
      opacity: 0.1,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20,
        duration: 1.5,
      },
    },
  };

  return (
    <motion.div
      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-16 relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"
          variants={backgroundCircleVariants}
        ></motion.div>
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"
          variants={backgroundCircleVariants}
          transition={{ delay: 0.5 }}
        ></motion.div>
      </div>

      {/* Background Image */}
      <motion.div
        className="absolute right-0 top-0 bottom-0 w-1/3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.2 }}
        viewport={{ once: true }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <img
          src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
          alt="People connecting globally"
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div className="maximum-w mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.h3
              className="text-4xl lg:text-5xl font-bold mb-6 leading-tight"
              variants={textVariants}
            >
              Ready to Start Your{" "}
              <motion.span
                className="text-yellow-300"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.8,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                Language Journey
              </motion.span>
              ?
            </motion.h3>
            <motion.p
              className="text-blue-100 text-xl mb-8 max-w-2xl leading-relaxed"
              variants={textVariants}
            >
              Join{" "}
              <motion.span
                className="font-bold text-white"
                initial={{ scale: 1 }}
                whileInView={{ scale: 1.1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 1,
                  type: "spring",
                  stiffness: 300,
                }}
              >
                2.5+ million
              </motion.span>{" "}
              language partners worldwide. Practice naturally, make friends
              across cultures, and learn together through real conversations.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              variants={containerVariants}
            >
              <Link to={"/dashboard/follow"}>
                <motion.button
                  className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 min-w-[200px]"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <motion.span
                    whileHover={{ rotate: 360 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <Users />
                  </motion.span>
                  Find Your Partner - Free!
                </motion.button>
              </Link>
              <motion.button
                onClick={() => {
                  const section = document.getElementById("howItsWork");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="px-8 py-4 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center gap-3 min-w-[200px]"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <motion.span
                  whileHover={{ rotate: 90 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Settings />
                </motion.span>
                How It Works
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="flex flex-wrap justify-center lg:justify-start items-center gap-6 mt-8 text-blue-200"
              variants={containerVariants}
            >
              {[
                "No credit card required",
                "Instant matching",
                "Safe & verified partners",
              ].map((text, index) => (
                <motion.div
                  key={text}
                  className="flex items-center gap-2"
                  variants={trustIndicatorVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                >
                  <motion.span
                    className="text-green-400"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 1.4 + index * 0.1,
                      type: "spring",
                      stiffness: 300,
                    }}
                  >
                    ✓
                  </motion.span>
                  <span>{text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Featured Image */}
          <motion.div
            className="flex-1 flex justify-center"
            variants={imageVariants}
          >
            <div className="relative">
              <motion.div
                className="w-80 h-80 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl backdrop-blur-sm border border-white/20 p-6 flex items-center justify-center"
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  transition: { type: "spring", stiffness: 200 },
                }}
              >
                <motion.img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                  alt="Happy language exchange partners"
                  className="w-full h-full object-cover rounded-2xl shadow-2xl"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                />
              </motion.div>

              {/* Floating Stats Card */}
              <motion.div
                className="absolute -bottom-6 -left-6 bg-white text-gray-800 p-4 rounded-2xl shadow-2xl border border-gray-200"
                variants={floatingCardVariants}
                whileHover="hover"
              >
                <div className="text-center">
                  <motion.div
                    className="text-2xl font-bold text-blue-600"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 1.5,
                      type: "spring",
                      stiffness: 200,
                    }}
                  >
                    45K+
                  </motion.div>
                  <div className="text-sm font-medium">Active Partners</div>
                  <div className="text-xs text-gray-500 mt-1">Online now</div>
                </div>
              </motion.div>

              {/* Another Floating Element */}
              <motion.div
                className="absolute -top-4 -right-4 bg-yellow-400 text-gray-800 p-3 rounded-xl shadow-2xl"
                variants={floatingCardVariants}
                whileHover="hover"
                transition={{ delay: 1.7 }}
              >
                <div className="text-center">
                  <motion.div
                    className="text-lg font-bold"
                    animate={{
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    🌍
                  </motion.div>
                  <div className="text-xs font-bold">180+ Countries</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Ads;
