import CountUp from "react-countup";
import {
  FaComments,
  FaHeart,
  FaExchangeAlt,
  FaUserFriends,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function LanguageExchangeStats() {
  const stats = [
    {
      id: 1,
      icon: <FaUserFriends className="text-5xl text-blue-500" />,
      value: 2.5,
      suffix: "M+",
      label: "Language Partners",
      desc: "Native speakers ready to exchange",
    },
    {
      id: 2,
      icon: <FaExchangeAlt className="text-5xl text-green-500" />,
      value: 15,
      suffix: "M+",
      label: "Exchanges Made",
      desc: "Successful language practice sessions",
    },
    {
      id: 3,
      icon: <FaComments className="text-5xl text-purple-500" />,
      value: 180,
      suffix: "+",
      label: "Languages Available",
      desc: "From common to rare languages",
    },
    {
      id: 4,
      icon: <FaHeart className="text-5xl text-red-400" />,
      value: 98,
      suffix: "%",
      label: "Satisfaction Rate",
      desc: "Partners love exchanging here",
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

  const itemVariants = {
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
      scale: 1.1,
      rotate: 360,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10,
      },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4">
      {/* Header Section */}
      <motion.div
        className="max-w-6xl mx-auto text-center mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={headerVariants}
      >
        <motion.h2
          className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6"
          variants={headerVariants}
        >
          Connect & Exchange Languages 🌐
        </motion.h2>
        <motion.p
          className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          variants={headerVariants}
        >
          Practice languages with native speakers through text, voice, and video
          exchanges. Make friends while learning naturally.
        </motion.p>
      </motion.div>

      {/* Stats Grid - Focused on Exchange */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {stats.map((item, index) => (
          <motion.div
            key={item.id}
            className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 group cursor-pointer"
            variants={itemVariants}
            whileHover={{
              scale: 1.05,
              y: -10,
              transition: { type: "spring", stiffness: 300 },
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              variants={iconVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover="hover"
              className="transform"
            >
              {item.icon}
            </motion.div>

            <motion.h2
              className="text-4xl font-bold mt-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.5 + index * 0.1,
                type: "spring",
                stiffness: 200,
              }}
            >
              <CountUp
                end={item.value}
                duration={3}
                delay={0.5}
                decimals={item.value % 1 !== 0 ? 1 : 0}
              />
              {item.suffix}
            </motion.h2>

            <motion.p
              className="text-lg font-semibold text-gray-800 mt-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              {item.label}
            </motion.p>

            <motion.p
              className="text-gray-500 mt-3 text-center leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1 + index * 0.1 }}
            >
              {item.desc}
            </motion.p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
