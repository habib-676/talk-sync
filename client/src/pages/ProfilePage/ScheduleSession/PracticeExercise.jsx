import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaVolumeUp,
  FaMicrophone,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa"; // 🔹 Added react-icons

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "en-US";
recognition.continuous = false;

const PracticeExercise = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    phrases = [],
    topicTitle = "Speaking Practice",
    backPath = "/schedule", // 🔹 Added fallback backPath for safe navigation
  } = location.state || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [right, setRight] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [userSpeech, setUserSpeech] = useState("");
  const [alreadyWrong, setAlreadyWrong] = useState(false); // 🔹 Added: prevent multiple wrong increments

  const currentPhrase = phrases[currentIndex];

  // 🔹 Normalize helper
  const normalize = (s = "") =>
    s.toLowerCase().replace(/[.,!?;:()"'-]/g, "").replace(/\s+/g, " ").trim();

  // 🔹 Play pronunciation
  const handlePlayAudio = () => {
    const utterance = new SpeechSynthesisUtterance(currentPhrase);
    utterance.lang = "en-US";
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  // 🔹 Speech recognition handler
  const handleSpeak = () => {
    recognition.start();

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setUserSpeech(speechResult);

      const normalizedSpeech = normalize(speechResult);
      const normalizedPhrase = normalize(currentPhrase);

      if (normalizedSpeech === normalizedPhrase) {
        toast.success("✅ Correct pronunciation!");
        setRight((prev) => prev + 1);
        setAlreadyWrong(false); // reset for next phrase
      } else {
        if (!alreadyWrong) {
          // 🔹 Prevent incrementing wrong multiple times for same phrase
          toast.error("❌ Try again!");
          setWrong((prev) => prev + 1);
          setAlreadyWrong(true);
        } else {
          toast("Keep practicing — you'll get it!", { icon: "🎯" });
        }
      }
    };

    recognition.onerror = () => {
      toast.error("Speech recognition not supported or denied.");
    };
  };

  // 🔹 Move to next phrase
  const handleNext = () => {
    if (currentIndex < phrases.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserSpeech("");
      setAlreadyWrong(false); // reset for next phrase
    } else {
      toast.success("🎉phrases completed!");
      navigate(backPath); // 🔹 Back to selected level instead of -1
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center mt-10 bg-gradient-to-br from-gray-50 to-gray-100"> {/* 🔹 Softer background */}
      <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 rounded-2xl shadow-xl p-8 relative text-center border border-gray-200">
        {/* 🔹 Back button */}
        <button
          onClick={() => navigate(backPath)}
          className="absolute left-4 top-4 flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition"
        >
          <FaArrowLeft /> Back
        </button>

        <h2 className="text-2xl font-bold text-indigo-700 mb-4">
          {topicTitle}
        </h2>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <p className="text-2xl font-semibold text-gray-800">
            🗣️ {currentPhrase}
          </p>
        </div>

        {/* 🔹 Buttons area */}
        <div className="flex justify-center gap-5 mb-5">
          <button
            onClick={handlePlayAudio}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition font-medium shadow-sm"
          >
            <FaVolumeUp /> Listen
          </button>

          <button
            onClick={handleSpeak}
            className="flex items-center gap-2 px-5 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition font-medium shadow-sm"
          >
            <FaMicrophone /> Speak
          </button>
        </div>

        {/* 🔹 User speech result */}
        {userSpeech && (
          <div className="mt-4 bg-gray-50 py-3 px-4 rounded-lg border border-gray-200">
            <p className="text-gray-700">
              You said:{" "}
              <span className="font-semibold text-indigo-700">
                {userSpeech}
              </span>
            </p>
          </div>
        )}

        {/* 🔹 Progress stats */}
        <div className="mt-6 flex justify-center gap-6 text-sm font-medium">
          <span className="flex items-center gap-1 text-green-600">
            <FaCheckCircle /> Right: {right}
          </span>
          <span className="flex items-center gap-1 text-red-500">
            <FaTimesCircle /> Wrong: {wrong}
          </span>
        </div>

        {/* 🔹 Next button */}
        <button
          onClick={handleNext}
          className="mt-8 w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition font-semibold shadow-md"
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default PracticeExercise;
