import React from "react";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { FaHeart } from "react-icons/fa";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const PopularLanguages = () => {
  const languages = [
    {
      name: "English",
      image:
        "https://i.ibb.co.com/Tq4nx3nV/7508709.jpg",
      desc: "Speak confidently in global conversations and master communication skills.",
    },
    {
      name: "Spanish",
      image:
        "https://i.ibb.co.com/RkHMxtWL/7685309.jpg",
      desc: "Discover the warmth of Latin culture and learn through immersive sessions.",
    },
    {
      name: "Arabic",
      image:
        "https://i.ibb.co.com/NgSWkkT4/learning-Arabic.jpg",
      desc: "Master Arabic from native tutors and explore its rich heritage and expressions.",
    },
    {
      name: "Japanese",
      image:
        "https://i.ibb.co.com/356YnDPR/26094.jpg",
      desc: "Experience the beauty of Japanese language and culture with real-life examples.",
    },
    {
      name: "French",
      image:
        "https://i.ibb.co.com/MxhrB1Rk/learning-French.jpg",
      desc: "Learn to speak French like a Parisian — elegant, expressive, and fluent.",
    },
  ];

  return (
    <div className="py-16 px-4 ">
      <h2 className="text-3xl text-primary font-bold text-center mb-5">
       Unlock New Cultures with Popular Language Courses
      </h2>
      <div className="w-30 sm:w-24 h-1 bg-success mx-auto mb-10 lg:mb-10 rounded-full"></div>

      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 150,
          modifier: 1,
          slideShadows: false,
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="max-w-6xl mx-auto"
      >
        {languages.map((lang, index) => (
          <SwiperSlide
            key={index}
            style={{
              width: "400px",
            }}
            className="bg-white rounded-lg overflow-hidden shadow-md relative px-5"
          >
            <div className="relative">
              <img
                src={lang.image}
                alt={lang.name}
                className="w-full h-64 object-cover"
              />
              <Tippy
                content={
                  <div className="text-left">
                    <h2 className="font-bold text-sm mb-1">
                      Save your favorite
                    </h2>
                    <p className="text-xs">Sign in to save and get information.</p>
                  </div>
                }
                placement="top"
              >
                <button className="absolute top-2 right-2 text-white p-2 rounded-full">
                  <FaHeart className="text-red-400" />
                </button>
              </Tippy>
            </div>

            <div className="p-4">
              <h3 className="text-secondary text-xl font-semibold">
                {lang.name}
              </h3>
              <p className="text-sm text-primary mt-1 mb-2">{lang.desc}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PopularLanguages;
