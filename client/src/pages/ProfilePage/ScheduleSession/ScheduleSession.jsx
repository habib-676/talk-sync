import { useEffect, useState } from "react";
import { FaBookOpen, FaComments, FaGlobe, FaFont } from "react-icons/fa";
import DailyChallenge from "./DailyChallenge";
import SpeakingModal from "./SpeakingModal";
import LearningTips from "./LearningTips";

const ScheduleSession = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [wordsData, setWordsData] = useState([]);
  const [readingData, setReadingData] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ✅ Fetch JSON data from public folder
  
  // useEffect(() => {
  //   fetch("/wordsData.json")
  //     .then((res) => res.json())
  //     .then((data) => setWordsData(data))
  //     .catch((err) => console.error("Failed to load words JSON", err));

  //   // fetch("/readingData.json")
  //   //   .then((res) => res.json())
  //   //   .then((data) => setReadingData(data))
  //   //   .catch((err) => console.error("Failed to load reading JSON", err));
  // }, []);


// Read
useEffect(() => {
  fetch("http://localhost:5000/books") // fetch from backend instead of local JSON
    .then((res) => res.json())
    .then((data) => setReadingData(data))
    .catch((err) => console.error("Failed to load books from backend", err));
}, []);
// Words
useEffect(() => {
  fetch("http://localhost:5000/words")
    .then((res) => res.json())
    .then((data) => setWordsData(data))
    .catch((err) => console.error("Failed to load words from backend", err));
}, []);




  // ✅ Reset selections when switching tabs
  const resetSelections = () => {
    setSelectedLevel(null);
    setSelectedCategory(null);
    setSelectedLesson(null);
  };

  // ✅ Tab icons
  const tabIcons = {
    all: <FaGlobe className="inline-block mr-2" />,
    speaking: <FaComments className="inline-block mr-2" />,
    words: <FaFont className="inline-block mr-2" />,
    reading: <FaBookOpen className="inline-block mr-2" />,
  };

  return (
    <div className="mt-20 min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-10 px-5 md:px-20">
      {/* Header Section */}
      <section className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 mb-3">
          Discover Your English Level — For Free
        </h1>
        <p className="text-gray-600 mb-6">
          Take a quick test or book a live class to improve your communication skills.
        </p>
      </section>

      {/* Tabs */}
      <section className="flex justify-center flex-wrap gap-4 mb-10">
        {["all", "words", "reading", "speaking"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              resetSelections();
            }}
            className={`px-6 py-2 rounded-full font-semibold capitalize transition-all flex items-center ${
              activeTab === tab
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                : "bg-white border border-gray-300 hover:bg-gray-100"
            }`}
          >
            {tabIcons[tab]}
            {tab}
          </button>
        ))}
      </section>

      {/* Dynamic Title & Description */}
      <div className="text-center mb-10">
        {activeTab === "words" && (
          <>
            <h2 className="text-3xl font-bold text-indigo-700">
              Improve Your English with Words 💬
            </h2>
            <p className="text-gray-600 mt-2">
              Build your vocabulary one level at a time — simple, fun, and effective!
            </p>
          </>
        )}
        {activeTab === "reading" && (
          <>
            <h2 className="text-3xl font-bold text-indigo-700">
              Master Reading, Master English 📖
            </h2>
            <p className="text-gray-600 mt-2">
              Sharpen your comprehension and enjoy engaging English passages.
            </p>
          </>
        )}
        {activeTab === "speaking" && (
          <>
            <h2 className="text-3xl font-bold text-indigo-700">
              Speak English with Confidence 🎤
            </h2>
            <p className="text-gray-600 mt-2">
              Practice real conversations, express naturally, and sound fluent!
            </p>
          </>
        )}
        {activeTab === "all" && (
          <>
            <h2 className="text-3xl font-bold text-indigo-700">
              Explore All English Learning Levels 🌍
            </h2>
            <p className="text-gray-600 mt-2">
              Begin your English journey — choose a level and start learning instantly.
            </p>
          </>
        )}
      </div>

      {/* Main Content */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* WORDS TAB */}
        {activeTab === "words" && (
          <>
            {/* Step 1: Level selection */}
            {!selectedLevel &&
              wordsData.map((level) => (
                <div
                  key={level.id}
                  onClick={() => setSelectedLevel(level)}
                  className="cursor-pointer bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-2xl hover:-translate-y-2 transition-transform border-t-4 border-indigo-300"
                >
                  <img
                    src={level.image}
                    alt={level.level}
                    className="w-24 h-24 mx-auto mb-4 rounded-full shadow"
                  />
                  <h3 className="text-xl font-semibold text-indigo-700">{level.level}</h3>
                  <p className="text-gray-600 mt-2">{level.description}</p>
                </div>
              ))}

            {/* Step 2: Category selection */}
            {selectedLevel && !selectedCategory && (
              <>
                <button
                  onClick={() => setSelectedLevel(null)}
                  className="col-span-full mb-5 text-lg text-indigo-600 underline"
                >
                  ← Back to Levels
                </button>
                {selectedLevel.categories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat)}
                    className="cursor-pointer bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-2 transition-transform text-center border-t-4 border-purple-300"
                  >
                    <div className="text-4xl mb-3">{cat.icon}</div>
                    <h4 className="text-lg font-semibold text-indigo-700">{cat.name}</h4>
                  </div>
                ))}
              </>
            )}

            {/* Step 3: Word list */}
            {selectedCategory && (
              <div className="col-span-full bg-white rounded-xl p-8 shadow-lg">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="mb-5 text-lg text-indigo-600 underline"
                >
                  ← Back to Categories
                </button>
                <h3 className="text-2xl font-bold text-indigo-700 mb-4">
                  {selectedCategory.name}
                </h3>
                <ul className="grid sm:grid-cols-2 gap-4">
                  {selectedCategory.words.map((w, idx) => (
                    <li
                      key={idx}
                      className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-gray-50"
                    >
                      <p className="font-semibold text-gray-800">{w.word}</p>
                      <p className="text-sm text-gray-600 italic">
                        Meaning: {w.meaning}
                      </p>
                      <p className="text-sm mt-2 text-gray-700">
                        Sentence: {w.example}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {/* READING TAB */}
        {activeTab === "reading" && (
          <>
            {/* Step 1: Level selection */}
            {!selectedLevel &&
              readingData.map((level, idx) => {
                const levelImages = [
                  "https://i.ibb.co.com/jZQsT1WP/Reading-glasses-bro.png",
                  "https://i.ibb.co.com/DDrCdZWY/Webinar-pana.png",
                  "https://i.ibb.co.com/xqdY75G0/Instruction-manual-cuate.png",
                ];
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedLevel(level)}
                    className="cursor-pointer bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-2xl hover:-translate-y-2 transition-transform border-t-4 border-indigo-300"
                  >
                    <img
                      src={levelImages[idx % levelImages.length]}
                      alt={level.level}
                      className="w-full h-48 object-contain rounded-lg mb-4 bg-white"
                    />
                    <h3 className="text-xl font-semibold text-indigo-700">
                      {level.level}
                    </h3>
                    <p className="text-gray-600 mt-2">
                      Explore {level.sets?.length || 0} reading sets.
                    </p>
                  </div>
                );
              })}

            {/* Step 2: Set selection */}
            {selectedLevel && !selectedCategory && (
              <>
                <button
                  onClick={() => setSelectedLevel(null)}
                  className="col-span-full mb-5 text-lg text-indigo-600 underline"
                >
                  ← Back to Levels
                </button>
                {selectedLevel.sets.map((set, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedCategory(set)}
                    className="cursor-pointer bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-2 transition-transform border-t-4 border-purple-300"
                  >
                    <h4 className="text-lg font-semibold text-indigo-700">{set.set}</h4>
                    <p className="text-gray-600 mt-2">
                      {set.lessons?.length || 0} lessons available
                    </p>
                  </div>
                ))}
              </>
            )}

            {/* Step 3: Lesson list */}
            {selectedCategory && !selectedLesson && (
              <div className="col-span-full bg-white rounded-xl p-8 shadow-lg">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="mb-5 text-lg text-indigo-600 underline"
                >
                  ← Back to Sets
                </button>
                <h3 className="text-2xl font-bold text-indigo-700 mb-4">
                  {selectedCategory.set}
                </h3>
                <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedCategory.lessons.map((lesson) => (
                    <li
                      key={lesson.id}
                      onClick={() => setSelectedLesson(lesson)}
                      className="cursor-pointer border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-gray-50"
                    >
                      <img
                        src={lesson.image}
                        alt={lesson.title}
                        className="w-full h-40 object-cover rounded-lg mb-3"
                      />
                      <p className="font-semibold text-gray-800">{lesson.title}</p>
                      <p className="text-sm text-gray-600">{lesson.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Step 4: Single Lesson View */}
            {selectedLesson && (
              <div className="col-span-full bg-white rounded-xl p-8 shadow-lg text-left">
                <button
                  onClick={() => setSelectedLesson(null)}
                  className="mb-5 text-lg text-indigo-600 underline"
                >
                  ← Back to Lessons
                </button>
                <h3 className="text-3xl font-bold text-indigo-700 mb-3">
                  {selectedLesson.title}
                </h3>
                <p className="text-gray-700 mb-5">{selectedLesson.description}</p>
                <img
                  src={selectedLesson.image}
                  alt={selectedLesson.title}
                  className="w-full max-w-md rounded-lg mb-6 shadow-md"
                />
                <div className="flex gap-4">
                  <a
                    href={selectedLesson.youtubeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-indigo-500 text-white px-5 py-2 rounded-lg hover:bg-indigo-600"
                  >
                    🎧 Watch on YouTube
                  </a>
                  <a
                    href={selectedLesson.pdfLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-purple-500 text-white px-5 py-2 rounded-lg hover:bg-purple-600"
                  >
                    📘 Read PDF
                  </a>
                </div>
              </div>
            )}
          </>
        )}

        {/* SPEAKING TAB */}
        {activeTab === "speaking" && (
          <>
            <div className="bg-white shadow-xl rounded-xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-transform border-t-4 border-indigo-400">
              <h3 className="font-bold text-xl text-indigo-700 mb-2">
                Personalized Live Class
              </h3>
              <p className="text-gray-600 mb-3">
                Book your personal tutor for live speaking practice.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-indigo-500 text-white px-5 py-2 rounded-lg hover:bg-indigo-600"
              >
                Book Tutor
              </button>
            </div>

            <div className="bg-white shadow-xl rounded-xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-transform border-t-4 border-purple-400">
              <h3 className="font-bold text-xl text-indigo-700 mb-2">
                Pro Partner Speaking Practice
              </h3>
              <p className="text-gray-600 mb-3">
                Practice with an English Pro Partner and enhance fluency.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-purple-500 text-white px-5 py-2 rounded-lg hover:bg-purple-600"
              >
                Start Now
              </button>
            </div>
          </>
        )}

        {/* ALL TAB */}
        {activeTab === "all" && (
          <div className="col-span-full text-center text-gray-600">
            Choose a category to explore learning options.
          </div>
        )}
      </section>

      {/* Speaking Modal */}
      {showModal && <SpeakingModal isOpen={showModal} onClose={() => setShowModal(false)} />}

      {/* Daily Challenge + Tips */}
      <section className="mt-20">
        <DailyChallenge />
      </section>

      <section className="mt-20">
        <LearningTips />
      </section>
    </div>
  );
};

export default ScheduleSession;
