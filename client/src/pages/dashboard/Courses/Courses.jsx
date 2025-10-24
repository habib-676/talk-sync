import React, { useState, useEffect } from "react";
import { BookOpen, ChevronDown, PlayCircle,ArrowRightCircle } from "lucide-react";
import IntroCourse from "./IntroCourse";
import { Link, useNavigate } from "react-router";

const Courses = () => {
  const [activeTab, setActiveTab] = useState("learn");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [tutorsData, setTutorsData] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);
  const navigate = useNavigate();

  const languages = [
    "All",
    "Spanish",
    "French",
    "Arabic",
    "Korean",
    "Japanese",
    "Turkish",
    "Portuguese",
    "Italian",
    "Hindi"
    
  ];

  // ✅ Fetch tutors.json from public folder
// useEffect(() => {
//   fetch("/tutor.json")
//     .then((res) => res.json())
//     .then((data) => {
//       setTutorsData(data); // ← directly set the array, not data.tutors
//       setFilteredTutors(data);
//     })
//     .catch((err) => console.error("Failed to load tutors:", err));
// }, []);



// ✅ Fetch tutor data from MongoDB API once on mount
useEffect(() => {
  fetch("http://localhost:5000/tutors")
    .then((res) => res.json())
    .then((data) => {
      setTutorsData(data);
      setFilteredTutors(data);
    })
    .catch((err) => console.error("Failed to load tutors from DB:", err));
}, []);



  // ✅ Filter tutors when language is selected
  useEffect(() => {
    if (selectedLanguage === "All") {
      setFilteredTutors(tutorsData);
    } else {
      const filtered = tutorsData.filter(
        (tutor) =>
          tutor.language.toLowerCase() === selectedLanguage.toLowerCase()
      );
      setFilteredTutors(filtered);
    }
  }, [selectedLanguage, tutorsData]);

  const handleLanguageClick = (lang) => {
    setSelectedLanguage(lang);
    setDropdownOpen(false);
    setActiveTab("courses");
  };

  const handleLearnMore = (tutor) => {
    navigate(`/dashboard/tutor/${tutor.id}`);
  };

  return (
    <div>
      <IntroCourse />

        <div className="p-6 lg:p-10">
      {/* Tabs */}
      <div className="flex justify-center gap-6 border-b border-gray-200 :border-gray-700 mb-8">
        {/* Learn Tab */}
        <button
          onClick={() => {
            setActiveTab("learn");
            navigate("/schedule");
          }}
          className={`pb-2 px-4 text-lg font-semibold ${
            activeTab === "learn"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-blue-500"
          }`}
        >
          Learn
        </button>

        {/* Want to Learn Tab with Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setActiveTab("courses");
              setDropdownOpen(!dropdownOpen);
            }}
            className={`pb-2 px-4 text-lg font-semibold flex items-center gap-1 ${
              activeTab === "courses"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-500"
            }`}
          >
            Want to Learn <ChevronDown size={18} />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-52 bg-white :bg-gray-800 shadow-xl rounded-xl z-20 border border-gray-100 :border-gray-700">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageClick(lang)}
                  className={`block w-full text-left px-4 py-2 rounded-md transition-colors ${
                    selectedLanguage === lang
                      ? "bg-blue-100 :bg-blue-900/40 font-semibold text-blue-700 :text-blue-200"
                      : "text-gray-700 :text-gray-200 hover:bg-blue-50 :hover:bg-blue-900/30"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-600 flex justify-center items-center gap-2">
          <BookOpen size={28} /> Learn from the Best Tutors Around the World
        </h2>
        <p className="text-gray-600 :text-gray-300 mt-3 leading-relaxed">
          Connect with expert tutors, master new languages, and achieve fluency through personalized lessons.
          Choose your preferred language and start learning now.
        </p>
      </div>

      {/* Tutors Grid */}
      <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        {filteredTutors.map((tutor) => (
          <div
            key={tutor.id}
            className="group bg-white :bg-gray-900 border border-gray-200 :border-gray-700 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            {/* Image */}
            <div className="relative w-full h-64 overflow-hidden">
              <img
                src={tutor.image}
                alt={tutor.name}
                className="w-full h-full object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>

            {/* Info */}
            <div className="p-6 flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 :text-white flex items-center gap-2">
                  {tutor.name}
                  {tutor.flag && (
                    <img
                      src={tutor.flag}
                      alt="flag"
                      className="w-6 h-4 object-cover rounded border border-gray-300 :border-gray-600"
                    />
                  )}
                </h3>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="flex items-center gap-1 bg-blue-100 :bg-blue-800 text-blue-800 :text-blue-100 text-xs font-semibold px-2.5 py-1 rounded-full">
                  <BookOpen size={14} /> {tutor.type}
                </span>
                {tutor.badge && (
                  <span className="flex items-center gap-1 bg-pink-100 :bg-pink-800 text-pink-800 :text-pink-100 text-xs font-semibold px-2.5 py-1 rounded-full">
                    🏅 {tutor.badge}
                  </span>
                )}
              </div>

              <p className="mt-3 text-sm text-gray-700 :text-gray-300 leading-relaxed">
                {tutor.description}
              </p>

              <div className="mt-4 text-sm text-gray-600 :text-gray-400 space-y-1">
                <p>
                  🌍 <strong>{tutor.language}</strong> Tutor —{" "}
                  <span className="text-gray-500">{tutor.experience}+ yrs exp.</span>
                </p>
                <p>
                  💬 Speaks:{" "}
                  <span className="font-semibold">
                    {tutor.speaks
                      .map((lang) => `${lang.language} (${lang.level})`)
                      .join(", ")}
                  </span>
                </p>
              </div>

              {/* Stats */}
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500 :text-gray-400 border-t border-gray-100 :border-gray-700 pt-3">
                <div className="flex items-center gap-1">
                  ⭐
                  <span className="font-medium text-gray-800 :text-gray-200">
                    {tutor.rating}
                  </span>
                  <span className="ml-1">({tutor.reviews} reviews)</span>
                </div>
                <div>
                  👩‍🎓 {tutor.students} students · 📘 {tutor.lessons} lessons
                </div>
              </div>

              {/* CTA */}
              {/* <Link to={`/dashboard/tutor/${tutor.id}`} className="mt-5">
                <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl shadow-md transition-all duration-300">
                  Learn Now <ArrowRightCircle size={20} />
                </button>
              </Link> */}

<Link to={`/dashboard/tutor/${tutor._id}`} className="mt-5">
  <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl shadow-md transition-all duration-300">
    Learn Now <ArrowRightCircle size={20} />
  </button>
</Link>




            </div>
          </div>
        ))}
      </div>

      {filteredTutors.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No tutors found for this language.
        </p>
      )}
    </div>

    </div>
  );
};

export default Courses;
