import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch("/reviews.json")
      .then((res) => res.json())
      .then((data) => setReviews(data));
  }, []);

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

  const cardVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 30,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6,
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      rotateY: 5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  };

  const imageVariants = {
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
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 8,
      },
    },
  };

  const starVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
    },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 200,
        damping: 10,
      },
    }),
    hover: {
      scale: 1.2,
      rotate: 180,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 8,
      },
    },
  };

  const textVariants = {
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
        duration: 0.6,
      },
    },
  };

  return (
    <motion.section
      className="maximum-w mx-auto px-4 py-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <motion.h2
        className="text-3xl font-bold text-center mb-12"
        variants={headerVariants}
      >
        WHAT PEOPLE SAY

      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        <Marquee gradient={false} speed={60} pauseOnHover={true}>
          <div className="flex space-x-6 p-10">
            {reviews.map((review, index) => (
              <motion.div
                key={index}
                className="bg-white border border-gray-200 rounded-3xl p-6 w-80 flex-shrink-0 shadow-lg hover:shadow-2xl cursor-pointer"
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover="hover"
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <motion.div variants={imageVariants} whileHover="hover">
                    <img
                      src={review.image}
                      alt={review.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-purple-500"
                    />
                  </motion.div>
                  <motion.h3
                    className="font-semibold text-lg"
                    variants={textVariants}
                  >
                    {review.name}
                  </motion.h3>
                </div>

                <motion.p
                  className="text-gray-700 mb-4 text-sm md:text-base leading-relaxed"
                  variants={textVariants}
                  transition={{ delay: 0.2 }}
                >
                  "{review.review}"
                </motion.p>

                <motion.div className="flex" variants={containerVariants}>
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <motion.svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      className="w-5 h-5 text-yellow-400"
                      viewBox="0 0 24 24"
                      custom={i}
                      variants={starVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      whileHover="hover"
                    >
                      <path d="M12 .587l3.668 7.568L24 9.423l-6 5.845L19.335 24 12 20.012 4.665 24 6 15.268 0 9.423l8.332-1.268z" />
                    </motion.svg>
                  ))}
                </motion.div>

                {/* Decorative elements */}
                <motion.div
                  className="absolute top-2 right-2 text-4xl opacity-10"
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
                >
                  "
                </motion.div>

                <motion.div
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1, type: "spring", stiffness: 150 }}
                ></motion.div>
              </motion.div>
            ))}
          </div>
        </Marquee>
      </motion.div>

      {/* Additional decorative elements */}
      <motion.div
        className="flex justify-center mt-8 gap-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.2 }}
      >
        {[1, 2, 3].map((dot) => (
          <motion.div
            key={dot}
            className="w-2 h-2 bg-gray-400 rounded-full"
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
    </motion.section>
  );
};

export default Reviews;
