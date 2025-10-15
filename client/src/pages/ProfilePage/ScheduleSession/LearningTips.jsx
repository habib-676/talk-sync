import { FaBookOpen, FaPodcast, FaRegLightbulb, FaLanguage, FaGlobe, FaChalkboardTeacher } from "react-icons/fa";

const LearningTips = () => {
  const tips = [
    {
      id: 1,
      title: "Use Flashcards for Vocabulary",
      description: "Boost your memory using flashcards. Tools like Quizlet make learning fun and visual.",
      icon: <FaBookOpen size={35} />,
      link: "https://quizlet.com",
    },
    {
      id: 2,
      title: "Listen to English Podcasts",
      description: "Daily podcasts help you understand real-life English conversations and accents.",
      icon: <FaPodcast size={35} />,
      link: "https://www.bbc.co.uk/learningenglish/english/features/the-english-we-speak",
    },
    {
      id: 3,
      title: "Read Short Stories or Comics",
      description: "Enjoy learning through easy-to-read stories that enhance comprehension and vocabulary.",
      icon: <FaRegLightbulb size={35} />,
<<<<<<< Updated upstream
      link: "https://www.jilliantamaki.com/short-comics",
=======
      link: "https://www.english-for-students.com/short-stories.html",
>>>>>>> Stashed changes
    },
    {
      id: 4,
      title: "Shadow Native Speakers",
      description: "Imitate real conversations by repeating after native speakers. Great for pronunciation!",
      icon: <FaLanguage size={35} />,
      link: "https://www.youtube.com/@BBCLEARNINGENGLISH",
    },
    {
      id: 5,
      title: "Practice Daily with Free Apps",
      description: "Apps like Duolingo make consistent learning easy and enjoyable.",
      icon: <FaGlobe size={35} />,
      link: "https://www.duolingo.com",
    },
    {
      id: 6,
      title: "Join Online Study Communities",
      description: "Discuss, learn, and grow with others studying English online.",
      icon: <FaChalkboardTeacher size={35} />,
      link: "https://www.reddit.com/r/EnglishLearning/",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-green-50 to-indigo-50 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-indigo-700 mb-3">
        💡 English Learning Tips & Resources
      </h2>
      <p className="text-gray-600 mb-12">
        Master English faster with these expert tips and free learning resources.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 px-5 md:px-16">
        {tips.map((tip) => (
          <div
            key={tip.id}
            className="group bg-white rounded-2xl shadow-lg p-8 border border-gray-200 hover:border-indigo-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className="text-indigo-500 mb-5 flex justify-center group-hover:text-green-500">
              {tip.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{tip.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{tip.description}</p>

            <a
              href={tip.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-500 transition-all duration-300"
            >
              Try Now ↗
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LearningTips;
