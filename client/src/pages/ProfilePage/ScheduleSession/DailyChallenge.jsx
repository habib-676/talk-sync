import { FaBookReader, FaHeadphonesAlt, FaPenFancy, FaGlobeAmericas } from "react-icons/fa";

const DailyChallenge = () => {
  const challenges = [
    {
      id: 1,
      title: "Vocabulary Builder",
      description: "Learn 5 new English words and use them in your own sentences.",
      icon: <FaBookReader size={35} />,
    },
    {
      id: 2,
      title: "Listening Practice",
      description: "Listen to a 2-minute podcast and note down 3 new expressions.",
      icon: <FaHeadphonesAlt size={35} />,
    },
    {
      id: 3,
      title: "Writing Boost",
      description: "Write a short paragraph about your favorite movie or place.",
      icon: <FaPenFancy size={35} />,
    },
    {
      id: 4,
      title: "Cultural Explorer",
      description: "Read one English news article and summarize it in 3 lines.",
      icon: <FaGlobeAmericas size={35} />,
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-green-50 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-indigo-700 mb-3">
        🌟 Daily English Challenge
      </h2>
      <p className="text-gray-600 mb-12">
        Improve your English step-by-step with small, fun daily challenges.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 justify-center px-5 md:px-16">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className="relative group bg-accent text-white rounded-2xl p-8 shadow-xl transform hover:-translate-y-2 transition-all duration-300 hover:bg-info hover:text-black"
          >
            <div className="text-linfo group-hover:text-black mb-5 flex justify-center">
              {challenge.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{challenge.title}</h3>
            <p className="text-sm opacity-90 mb-4">{challenge.description}</p>

            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-white group-hover:bg-black text-black group-hover:text-lime-400 p-3 rounded-full shadow-md">
              <span className="text-lg">↗</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DailyChallenge;
