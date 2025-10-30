import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router";
import {
  FaComments,
  FaExchangeAlt,
  FaUserFriends,
  FaVideo,
} from "react-icons/fa";
import { motion } from "framer-motion";

const languagePartners = [
  {
    id: 1,
    name: "German",
    flag: "https://flagcdn.com/w40/de.png",
    partners: "45K+",
    description: "Connect with native German speakers",
    learners: "English, Spanish, French",
  },
  {
    id: 2,
    name: "Japanese",
    flag: "https://flagcdn.com/w40/jp.png",
    partners: "38K+",
    description: "Practice with Japanese natives",
    learners: "English, Korean, Chinese",
  },
  {
    id: 3,
    name: "Spanish",
    flag: "https://flagcdn.com/w40/es.png",
    partners: "120K+",
    description: "Largest community of speakers",
    learners: "English, Portuguese, French",
  },
  {
    id: 4,
    name: "French",
    flag: "https://flagcdn.com/w40/fr.png",
    partners: "85K+",
    description: "Romance language enthusiasts",
    learners: "English, Spanish, German",
  },
  {
    id: 5,
    name: "Chinese",
    flag: "https://flagcdn.com/w40/cn.png",
    partners: "65K+",
    description: "Mandarin speakers worldwide",
    learners: "English, Japanese, Korean",
  },
  {
    id: 6,
    name: "Arabic",
    flag: "https://flagcdn.com/w40/ae.png",
    partners: "32K+",
    description: "Diverse Arabic dialects",
    learners: "English, French, Spanish",
  },
  {
    id: 7,
    name: "Portuguese",
    flag: "https://flagcdn.com/w40/pt.png",
    partners: "55K+",
    description: "Brazilian & European varieties",
    learners: "English, Spanish, French",
  },
  {
    id: 8,
    name: "Korean",
    flag: "https://flagcdn.com/w40/kr.png",
    partners: "42K+",
    description: "K-pop and K-drama fans",
    learners: "English, Japanese, Chinese",
  },
  {
    id: 9,
    name: "Italian",
    flag: "https://flagcdn.com/w40/it.png",
    partners: "28K+",
    description: "Culture and cuisine lovers",
    learners: "English, Spanish, French",
  },
  {
    id: 10,
    name: "Russian",
    flag: "https://flagcdn.com/w40/ru.png",
    partners: "35K+",
    description: "Slavic language exchange",
    learners: "English, German, French",
  },
];

const FlagsWithCountry = () => {
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
      y: 40,
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
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        delay: 0.5,
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
      y: -12,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  };

  const flagVariants = {
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
      scale: 1.15,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 8,
      },
    },
  };

  const iconVariants = {
    hover: {
      scale: 1.2,
      rotate: 180,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10,
      },
    },
  };

  const navButtonVariants = {
    hover: {
      scale: 1.1,
      backgroundColor: "#f8fafc",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  return (
    <motion.div
      className="bg-primary/5 py-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      {/* Language Partners Swiper Section */}
      <motion.div
        className="max-w-6xl mx-auto text-center mb-12"
        variants={headerVariants}
      >
        <motion.h2
          className="text-3xl font-bold text-gray-900 mb-4"
          variants={headerVariants}
        >
          FIND YOUR LANGUAGE PARTNER 🤝
        </motion.h2>
        <motion.p
          className="text-gray-600 text-lg max-w-2xl mx-auto mb-8"
          variants={headerVariants}
        >
          Connect with native speakers who want to learn your language while
          helping you learn theirs
        </motion.p>
        <motion.div
          className="flex justify-center gap-4 mt-6 flex-wrap"
          variants={containerVariants}
        >
          <Link to={"/follow"}>
            <motion.button
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <motion.span variants={iconVariants} whileHover="hover">
                <FaUserFriends className="text-sm" />
              </motion.span>
              Find Partners Now
            </motion.button>
          </Link>
          <motion.button
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center gap-2"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <motion.span variants={iconVariants} whileHover="hover">
              <FaVideo className="text-sm" />
            </motion.span>
            Start Video Exchange
          </motion.button>
        </motion.div>
      </motion.div>

      <div className="maximum-w mx-auto px-4">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={25}
          slidesPerView={4}
          navigation={{
            nextEl: ".partners-next",
            prevEl: ".partners-prev",
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
            renderBullet: function (index, className) {
              return (
                '<span class="' +
                className +
                ' bg-gradient-to-r from-blue-500 to-indigo-500"></span>'
              );
            },
          }}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={true}
          speed={800}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 15,
            },
            480: {
              slidesPerView: 2,
              spaceBetween: 15,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 25,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 25,
            },
          }}
          className="py-16 px-10"
        >
          {languagePartners.map((language, index) => (
            <SwiperSlide key={language.id}>
              <motion.div
                className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 group cursor-pointer"
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                whileHover="hover"
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  className="relative mb-4"
                  variants={flagVariants}
                  whileHover="hover"
                >
                  <img
                    src={language.flag}
                    alt={language.name}
                    className="w-20 h-20 rounded-full shadow-md object-cover border-4 border-white"
                  />
                  <motion.div
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg"
                    whileHover={{
                      scale: 1.2,
                      rotate: 360,
                      transition: { type: "spring", stiffness: 300 },
                    }}
                  >
                    <FaComments className="text-white text-sm" />
                  </motion.div>
                </motion.div>

                <motion.h3
                  className="font-bold text-gray-800 text-lg mb-2 text-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  {language.name}
                </motion.h3>

                <motion.div
                  className="flex items-center justify-center mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <FaUserFriends className="text-blue-500 text-xs mr-2" />
                  <span className="text-sm font-semibold text-gray-700">
                    {language.partners} partners
                  </span>
                </motion.div>

                <motion.p
                  className="text-sm text-gray-600 text-center mb-3 leading-tight"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {language.description}
                </motion.p>

                <motion.div
                  className="bg-gray-50 rounded-lg p-3 w-full mb-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <p className="text-xs text-gray-500 mb-1">
                    Looking to learn:
                  </p>
                  <p className="text-sm font-medium text-gray-700">
                    {language.learners}
                  </p>
                </motion.div>

                <Link to={"/follow"}>
                  <motion.button
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg flex items-center justify-center gap-2"
                    whileHover={{
                      scale: 1.05,
                      transition: { type: "spring", stiffness: 400 },
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.span
                      whileHover={{ rotate: 90 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <FaExchangeAlt className="text-xs" />
                    </motion.span>
                    Connect & Exchange
                  </motion.button>
                </Link>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation */}
        <motion.div
          className="flex justify-center gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            className="partners-prev bg-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center border border-gray-200 group"
            variants={navButtonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            ←
          </motion.button>
          <motion.button
            className="partners-next bg-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center border border-gray-200 group"
            variants={navButtonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            →
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FlagsWithCountry;
