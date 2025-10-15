import CountUp from "react-countup";
import {
  FaComments,
  FaHeart,
  FaExchangeAlt,
  FaUserFriends,
} from "react-icons/fa";

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

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
          Connect & Exchange Languages 🌐
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Practice languages with native speakers through text, voice, and video
          exchanges. Make friends while learning naturally.
        </p>
      </div>

      {/* Stats Grid - Focused on Exchange */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-20">
        {stats.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-500 border border-gray-100 group"
          >
            <div className="transform group-hover:scale-110 transition-transform duration-300">
              {item.icon}
            </div>
            <h2 className="text-4xl font-bold mt-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              <CountUp end={item.value} duration={3} />
              {item.suffix}
            </h2>
            <p className="text-lg font-semibold text-gray-800 mt-2">
              {item.label}
            </p>
            <p className="text-gray-500 mt-3 text-center leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
