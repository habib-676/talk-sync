import { useEffect, useState } from "react";

const ScheduleSession = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [wordsData, setWordsData] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // ✅ Fetch JSON data
  useEffect(() => {
  fetch("/wordsData.json")
    .then((res) => res.json())
    .then((data) => setWordsData(data)) // ✅ directly set array
    .catch((err) => console.error("Failed to load JSON", err));
}, []);

  return (
    <div className="mt-20 min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-10 px-5 md:px-20">
      {/* Call to Action */}
      <section className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 mb-3">
          Discover Your English Level — For Free
        </h1>
        <p className="text-gray-600 mb-6">
          Take a quick test or book a live class to improve your communication skills.
        </p>
        <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-semibold hover:scale-105 transition-transform">
          Take Free Test
        </button>
      </section>

      {/* Category Buttons */}
      <section className="flex justify-center flex-wrap gap-4 mb-10">
        {["all", "speaking", "words", "reading"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSelectedLevel(null);
              setSelectedCategory(null);
            }}
            className={`px-6 py-2 rounded-full font-semibold capitalize transition-all ${
              activeTab === tab
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                : "bg-white border border-gray-300 hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </section>

      {/* Dynamic Content Section */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* SPEAKING */}
        {activeTab === "speaking" && (
          <>
            <div className="bg-white shadow-lg rounded-xl p-5 hover:shadow-2xl transition">
              <h3 className="font-bold text-xl text-indigo-700 mb-2">
                Personalized Live Class
              </h3>
              <p className="text-gray-600 mb-3">Book your personal tutor for live speaking practice.</p>
              <button className="bg-indigo-500 text-white px-5 py-2 rounded-lg hover:bg-indigo-600">
                Book Tutor
              </button>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-5 hover:shadow-2xl transition">
              <h3 className="font-bold text-xl text-indigo-700 mb-2">
                Pro Partner Speaking Practice
              </h3>
              <p className="text-gray-600 mb-3">
                Practice with an English Pro Partner and enhance fluency.
              </p>
              <button className="bg-purple-500 text-white px-5 py-2 rounded-lg hover:bg-purple-600">
                Start Now
              </button>
            </div>
          </>
        )}

        {/* WORDS */}
        {activeTab === "words" && (
          <>
            {/* STEP 1: Level Selection */}
            {!selectedLevel && (
              wordsData.map((level) => (
                <div
                  key={level.id}
                  onClick={() => setSelectedLevel(level)}
                  className="cursor-pointer bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-2xl transition-transform transform hover:-translate-y-2"
                >
                  <img
                    src={level.image}
                    alt={level.level}
                    className="w-24 h-24 mx-auto mb-4 rounded-full shadow"
                  />
                  <h3 className="text-xl font-semibold text-indigo-700">{level.level}</h3>
                  <p className="text-gray-600 mt-2">{level.description}</p>
                </div>
              ))
            )}

            {/* STEP 2: Category Selection */}
            {selectedLevel && !selectedCategory && (
              selectedLevel.categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  className="cursor-pointer bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-transform transform hover:-translate-y-2"
                >
                  <div className="text-4xl mb-3">{cat.icon}</div>
                  <h4 className="text-lg font-semibold text-indigo-700">{cat.name}</h4>
                </div>
              ))
            )}

            {/* STEP 3: Word Details */}
            {selectedCategory && (
              <div className="col-span-full bg-white rounded-xl p-8 shadow-lg">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="mb-5 text-sm text-indigo-600 underline"
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
                      className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
                    >
                      <p className="font-semibold text-gray-800">{w.word}</p>
                      <p className="text-sm text-gray-600 italic">{w.meaning}</p>
                      <p className="text-sm mt-2 text-gray-700">{w.example}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {/* READING */}
        {activeTab === "reading" && (
          <div className="col-span-full text-center text-gray-600">
            Reading feature coming soon... 📚
          </div>
        )}

        {/* DEFAULT */}
        {activeTab === "all" && (
          <div className="col-span-full text-center text-gray-600">
            Choose a category to explore learning options.
          </div>
        )}
      </section>
    </div>
  );
};

export default ScheduleSession;
