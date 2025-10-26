import React, { useState, useEffect } from "react";
import { BookOpen, ChevronDown, ArrowRightCircle } from "lucide-react";
import IntroCourse from "./IntroCourse";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";

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
    "Hindi",
  ];

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/tutors`)
      .then((res) => res.json())
      .then((data) => {
        setTutorsData(data);
        setFilteredTutors(data);
      })
      .catch((err) => console.error("Failed to load tutors from DB:", err));
  }, []);

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
        <div className="flex justify-center gap-6 border-b border-gray-200 mb-10">
          {/* Learn Tab */}
          <button
            onClick={() => {
              setActiveTab("learn");
              navigate("/schedule");
            }}
            className={`pb-3 px-4 text-lg font-semibold relative transition-all ${
              activeTab === "learn"
                ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-blue-600 after:rounded-full"
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
              className={`pb-3 px-4 text-lg font-semibold flex items-center gap-1 transition-all ${
                activeTab === "courses"
                  ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-blue-600 after:rounded-full"
                  : "text-gray-500 hover:text-blue-500"
              }`}
            >
              Want to Learn <ChevronDown size={18} />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 mt-3 w-56 bg-white shadow-lg rounded-2xl z-20 border border-gray-100 overflow-hidden animate-fadeIn">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageClick(lang)}
                    className={`block w-full text-left px-4 py-2.5 transition-all duration-200 ${
                      selectedLanguage === lang
                        ? "bg-blue-50 font-semibold text-blue-700"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
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
          <p className="text-gray-600 mt-3 text-base leading-relaxed">
            Connect with expert tutors, master new languages, and achieve
            fluency through personalized lessons. Choose your preferred language
            and start learning now.
          </p>
        </div>

        {/* Tutors Grid */}
        <div className="mt-14 grid gap-10 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {filteredTutors.map((tutor, index) => (
            <motion.div
              key={tutor.id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="group relative rounded-3xl bg-white/80 backdrop-blur-sm border border-gray-100 hover:border-transparent shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2 hover:bg-gradient-to-br from-white via-blue-50 to-indigo-50"
            >
              {/* Image Section */}
              <div className="relative w-full h-64 overflow-hidden">
                <img
                  src={tutor.image}
                  alt={tutor.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>

                {/* Floating badge */}
                {tutor.badge && (
                  <span className="absolute top-3 right-3 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                    🏅 {tutor.badge}
                  </span>
                )}
              </div>

              {/* Info Section */}
              <div className="p-6 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    {tutor.name}
                    {tutor.flag && (
                      <img
                        src={tutor.flag}
                        alt="flag"
                        className="w-6 h-4 object-cover rounded border border-gray-200 shadow-sm"
                      />
                    )}
                  </h3>
                </div>

                {/* Language & Type Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                    <BookOpen size={14} /> {tutor.type}
                  </span>
                  <span className="flex items-center gap-1 bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                    🌍 {tutor.language}
                  </span>
                </div>

                {/* Description */}
                <div className="text-sm text-gray-600 leading-relaxed space-y-1">
                  <p>
                    💬 Speaks:{" "}
                    <span className="font-semibold text-gray-900">
                      {tutor.speaks
                        .map((lang) => `${lang.language} (${lang.level})`)
                        .join(", ")}
                    </span>
                  </p>
                  <p>
                    🎓 Experience:{" "}
                    <span className="font-semibold text-blue-700">
                      {tutor.experience}+ years
                    </span>
                  </p>
                </div>

                {/* Stats Section */}
                <div className="mt-5 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-1">
                    ⭐
                    <span className="font-medium text-gray-800">
                      {tutor.rating}
                    </span>
                    <span className="ml-1 text-gray-500">
                      ({tutor.reviews} reviews)
                    </span>
                  </div>
                  <div className="text-right">
                    👩‍🎓 {tutor.students} students · 📘 {tutor.lessons} lessons
                  </div>
                </div>

                {/* CTA Button */}
                <Link to={`/dashboard/tutor/${tutor._id}`} className="mt-6">
                  <button className="relative w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-300/40">
                    Learn Now
                    <ArrowRightCircle
                      size={20}
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </button>
                </Link>

                {/* Glow Hover Border */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 blur-[3px] transition-opacity duration-500 -z-10"></div>
              </div>
            </motion.div>
          ))}

          {filteredTutors.length === 0 && (
            <p className="text-center text-gray-500 mt-10">
              No tutors found for this language.
            </p>
          )}
        </div>
      </div>
    </div> 
  );
};

export default Courses;
