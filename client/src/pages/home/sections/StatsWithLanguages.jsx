import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import CountUp from "react-countup";
import { FaUsers, FaGlobe, FaLanguage, FaStar } from "react-icons/fa";

const languages = [
  { id: 1, name: "German", flag: "https://flagcdn.com/w40/de.png" },
  { id: 2, name: "Italian", flag: "https://flagcdn.com/w40/it.png" },
  { id: 3, name: "Russian", flag: "https://flagcdn.com/w40/ru.png" },
  { id: 4, name: "Portuguese", flag: "https://flagcdn.com/w40/pt.png" },
  { id: 5, name: "Turkish", flag: "https://flagcdn.com/w40/tr.png" },
  { id: 6, name: "French", flag: "https://flagcdn.com/w40/fr.png" },
  { id: 7, name: "Spanish", flag: "https://flagcdn.com/w40/es.png" },
];

export default function StatsWithLanguages() {
  const stats = [
    {
      id: 1,
      icon: <FaUsers className="text-5xl text-indigo-600" />,
      value: 60,
      suffix: "M+",
      label: "Global Users",
      desc: "Learners and tutors around the world.",
    },
    {
      id: 2,
      icon: <FaGlobe className="text-5xl text-green-600" />,
      value: 200,
      suffix: "+",
      label: "Countries & Regions",
      desc: "People practicing across diverse cultures.",
    },
    {
      id: 3,
      icon: <FaLanguage className="text-5xl text-red-500" />,
      value: 180,
      suffix: "+",
      label: "Languages Supported",
      desc: "From English to Turkish, learn anytime.",
    },
    {
      id: 4,
      icon: <FaStar className="text-5xl text-yellow-500" />,
      value: 5,
      suffix: "M+",
      label: "Sessions Completed",
      desc: "Successful practice sessions delivered.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50 px-4">
      {/* Counter Section */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold text-primary">
          Our Global Impact 🌍
        </h2>
        <p className="text-gray-600 mt-3">
          Connecting people through languages across the world.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto mb-16">
        {stats.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300"
          >
            {item.icon}
            <h2 className="text-3xl font-bold mt-4">
              <CountUp end={item.value} duration={3} />
              {item.suffix}
            </h2>
            <p className="text-lg font-semibold text-gray-700">{item.label}</p>
            <p className="text-success mt-2 text-sm text-center">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Swiper Section */}
      <div className="max-w-4xl mx-auto">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={4}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 2500 }}
          loop={true}
          breakpoints={{
            320: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 5 },
          }}
        >
          {languages.map((lang) => (
            <SwiperSlide key={lang.id}>
              <div className="flex flex-col items-center">
                <img
                  src={lang.flag}
                  alt={lang.name}
                  className="w-16 h-16 rounded-full shadow-md"
                />
                <p className="mt-2 text-success font-medium">{lang.name}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
