import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import {
  FaCheckCircle,
  FaRegCircle,
  FaTimesCircle,
  FaTrophy,
} from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

const TakeQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/quizzes`)
      .then((res) => setQuizzes(res.data))
      .catch(() => console.error("Failed to load quizzes"));
  }, []);

  const progress = quizzes.length
    ? (Object.keys(answers).length / quizzes.length) * 100
    : 0;

  const handleAnswer = (quizId, selected) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [quizId]: selected }));
  };

  const handleSubmit = async () => {
    if (submitted) return;

    let correctCount = 0;
    quizzes.forEach((q) => {
      if (q.correct === answers[q._id]?.toString()) correctCount += 1;
    });

    const total = quizzes.length;
    const wrong = total - correctCount;
    const percentage = ((correctCount / total) * 100).toFixed(2);
    setScore(correctCount);
    setSubmitted(true);

    const resultData = {
      email: user?.email,
      totalQuestions: total,
      correctAnswers: correctCount,
      wrongAnswers: wrong,
      percentage,
      date: new Date().toISOString(),
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/quizResults`, resultData);
    } catch (error) {
      console.error("Error saving result:", error);
    }
  };

  return (
    <motion.div
      className="relative min-h-screen flex flex-col items-center justify-start p-8 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* 🎉 Confetti when submitted */}
      {submitted && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={400}
        />
      )}

      {/* 🔹 Header */}
      <motion.h2
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-center bg-clip-text  drop-shadow-lg mb-8"
      >
        Interactive <span className="">Quiz</span>
      </motion.h2>

      {/* ✅ Floating Result Card */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ x: 150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed top-6 right-6 bg-white/70 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl p-6 w-80 z-50"
          >
            <div className="flex flex-col items-center">
              <FaTrophy className="text-yellow-500 text-4xl mb-2 drop-shadow-md" />
              <h3 className="text-2xl font-bold text-indigo-700 mb-1">
                Your Result
              </h3>
              <p className="text-gray-700 font-medium mb-2">
                {user?.email || "Guest User"}
              </p>
              <div className="text-center">
                <p className="text-3xl font-extrabold text-purple-600">
                  {((score / quizzes.length) * 100).toFixed(2)}%
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Score: <span className="text-indigo-600 font-semibold">{score}</span> /{" "}
                  {quizzes.length}
                </p>
                <div className="mt-3 text-sm text-gray-700">
                  ✅ Correct:{" "}
                  <span className="text-green-600 font-semibold">{score}</span> | ❌ Wrong:{" "}
                  <span className="text-red-500 font-semibold">
                    {quizzes.length - score}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Progress Bar */}
      <div className="w-full max-w-3xl mb-6 mt-6">
        <div className="flex justify-between text-sm mb-1 font-semibold text-gray-700">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-3 rounded-full shadow-md"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* ✅ Quiz Cards */}
      <div className="w-full max-w-6xl space-y-6">
        <AnimatePresence>
          {quizzes.map((q, i) => (
            <motion.div
              key={q._id}
              layout
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 hover:shadow-2xl border border-white/30 transition-all duration-300"
            >
              <p className="text-lg font-semibold mb-4 text-gray-800">
                {i + 1}. {q.question}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[q.option1, q.option2, q.option3, q.option4].map((opt, idx) => {
                  const selected = answers[q._id] === idx + 1;
                  const isCorrect = q.correct === (idx + 1).toString();
                  const isWrong =
                    submitted && selected && q.correct !== (idx + 1).toString();

                  let buttonStyle = "";

                  if (submitted) {
                    if (isCorrect)
                      buttonStyle =
                        "bg-green-500 text-white shadow-lg border-transparent";
                    else if (isWrong)
                      buttonStyle = "bg-red-500 text-white shadow-lg border-transparent";
                    else
                      buttonStyle =
                        "bg-white border-gray-300 opacity-70 text-gray-600";
                  } else {
                    buttonStyle = selected
                      ? "bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg"
                      : "bg-white hover:bg-gray-100 border border-gray-300";
                  }

                  return (
                    <motion.button
                      key={idx}
                      whileHover={!submitted ? { scale: 1.03 } : {}}
                      whileTap={!submitted ? { scale: 0.97 } : {}}
                      onClick={() => handleAnswer(q._id, idx + 1)}
                      disabled={submitted}
                      className={`flex items-center gap-3 py-3 px-4 rounded-xl text-left font-medium transition-all duration-300 ${buttonStyle}`}
                    >
                      {submitted ? (
                        isCorrect ? (
                          <FaCheckCircle className="text-white text-lg" />
                        ) : isWrong ? (
                          <FaTimesCircle className="text-white text-lg" />
                        ) : (
                          <FaRegCircle className="text-gray-400 text-lg" />
                        )
                      ) : selected ? (
                        <FaCheckCircle className="text-white text-lg" />
                      ) : (
                        <FaRegCircle className="text-gray-400 text-lg" />
                      )}
                      {opt}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ✅ Submit Button */}
      {!submitted && quizzes.length > 0 && (
        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          className="mt-10 px-10 py-4 font-bold text-lg rounded-full shadow-xl text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
        >
          Submit Quiz
        </motion.button>
      )}
    </motion.div>
  );
};

export default TakeQuiz;
