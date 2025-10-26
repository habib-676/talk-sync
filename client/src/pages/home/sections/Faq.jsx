import { use, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";

const faqPromise = fetch("/faq.json").then((res) => res.json());

const Faq = () => {
  const faqData = use(faqPromise);

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFaq = (id) => {
    setActiveIndex(activeIndex === id ? null : id);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const headerVariants = {
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

  const faqItemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
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
      y: -5,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  };

  const contentVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      y: -20,
    },
    visible: {
      opacity: 1,
      height: "auto",
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      y: -20,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        duration: 0.3,
      },
    },
  };

  const iconVariants = {
    closed: {
      rotate: 0,
      scale: 1,
    },
    open: {
      rotate: 180,
      scale: 1.1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  };

  return (
    <motion.section
      className="max-w-4xl mx-auto py-12 px-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      <motion.h2
        className="text-5xl font-bold text-center mb-8"
        variants={headerVariants}
      >
        <motion.span
          className="text-primary"
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.3,
            type: "spring",
            stiffness: 200,
          }}
        >
          Frequently
        </motion.span>{" "}
        Asked Questions
      </motion.h2>

      <motion.div
        className="space-y-4 mx-auto mt-10"
        variants={containerVariants}
      >
        {faqData.map((faq, index) => (
          <motion.div
            key={faq.id}
            variants={faqItemVariants}
            whileHover="hover"
            transition={{ delay: index * 0.1 }}
            className="border border-gray-200 rounded-xl shadow-sm bg-white overflow-hidden"
          >
            <motion.button
              className={`w-full p-6 text-left flex items-center justify-between font-semibold text-lg transition-all duration-300
                ${
                  activeIndex === faq.id
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-t-xl"
                    : "text-gray-800 hover:text-blue-600"
                }
              `}
              onClick={() => toggleFaq(faq.id)}
              whileHover={{
                backgroundColor:
                  activeIndex === faq.id
                    ? "rgba(59, 130, 246, 0.05)"
                    : "rgba(59, 130, 246, 0.02)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.span
                className="flex-1 pr-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                {faq.question}
              </motion.span>

              <motion.div
                variants={iconVariants}
                animate={activeIndex === faq.id ? "open" : "closed"}
                className="flex-shrink-0 w-6 h-6 text-blue-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {activeIndex === faq.id && (
                <motion.div
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="overflow-hidden"
                >
                  <motion.div
                    className="p-6 pt-0 text-gray-600 text-lg leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {faq.answer}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>

      {/* Decorative elements */}
      <motion.div
        className="flex justify-center mt-12 gap-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1 }}
      >
        {[1, 2, 3].map((dot) => (
          <motion.div
            key={dot}
            className="w-2 h-2 bg-blue-500 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: dot * 0.2,
            }}
          />
        ))}
      </motion.div>

      {/* Floating help text */}
      <motion.div
        className="text-center mt-8 text-gray-500"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1.2 }}
      >
        <motion.p
          animate={{
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          Can't find your answer?{" "}
          <motion.span
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
            whileHover={{ scale: 1.05 }}
          >
            <Link to={"/contact-us"}> Contact our support team</Link>
          </motion.span>
        </motion.p>
      </motion.div>
    </motion.section>
  );
};

export default Faq;
