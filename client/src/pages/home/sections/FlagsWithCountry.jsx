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
  return (
    <div className="bg-secondary/5 py-10">
      {/* Language Partners Swiper Section */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Find Your Language Partner 🤝
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
          Connect with native speakers who want to learn your language while
          helping you learn theirs
        </p>
        <div className="flex justify-center gap-4 mt-6 flex-wrap">
          <Link to={"/follow"}>
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2">
              <FaUserFriends className="text-sm" />
              Find Partners Now
            </button>
          </Link>
          <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2">
            <FaVideo className="text-sm" />
            Start Video Exchange
          </button>
        </div>
      </div>

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
          {languagePartners.map((language) => (
            <SwiperSlide key={language.id}>
              <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100 group cursor-pointer">
                <div className="relative mb-4">
                  <img
                    src={language.flag}
                    alt={language.name}
                    className="w-20 h-20 rounded-full shadow-md object-cover border-4 border-white group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <FaComments className="text-white text-sm" />
                  </div>
                </div>

                <h3 className="font-bold text-gray-800 text-lg mb-2 text-center">
                  {language.name}
                </h3>

                <div className="flex items-center justify-center mb-2">
                  <FaUserFriends className="text-blue-500 text-xs mr-2" />
                  <span className="text-sm font-semibold text-gray-700">
                    {language.partners} partners
                  </span>
                </div>

                <p className="text-sm text-gray-600 text-center mb-3 leading-tight">
                  {language.description}
                </p>

                <div className="bg-gray-50 rounded-lg p-3 w-full mb-4">
                  <p className="text-xs text-gray-500 mb-1">
                    Looking to learn:
                  </p>
                  <p className="text-sm font-medium text-gray-700">
                    {language.learners}
                  </p>
                </div>

                <Link to={"/follow"}>
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center gap-2">
                    <FaExchangeAlt className="text-xs" />
                    Connect & Exchange
                  </button>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation */}
        <div className="flex justify-center gap-4 mt-8">
          <button className="partners-prev bg-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:bg-gray-50 transition-all duration-300 transform hover:-translate-x-1 border border-gray-200 group">
            ←
          </button>
          <button className="partners-next bg-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:bg-gray-50 transition-all duration-300 transform hover:translate-x-1 border border-gray-200 group">
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlagsWithCountry;
