import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { FaCheckCircle, FaRegCircle, FaTimesCircle } from "react-icons/fa";

import useAuth from "../../../hooks/useAuth";

const TakeQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  //   const { user } = useContext(Authcontext);
  const { user } = useAuth();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/quizzes`)
      .then((res) => setQuizzes(res.data));
  }, []);

  const progress = quizzes.length
    ? (Object.keys(answers).length / quizzes.length) * 100
    : 0;

  const handleAnswer = (quizId, selected) => {
    if (submitted) return;
    setAnswers((prev) => ({
      ...prev,
      [quizId]: selected,
    }));
  };

  const handleSubmit = async () => {
    if (submitted) return;

    let correctCount = 0;
    quizzes.forEach((q) => {
      if (q.correct === answers[q._id]?.toString()) {
        correctCount += 1;
      }
    });

    const totalQuestions = quizzes.length;
    const wrongCount = totalQuestions - correctCount;
    const percentage = ((correctCount / totalQuestions) * 100).toFixed(2);

    setScore(correctCount);
    setSubmitted(true);

    const resultData = {
      email: user?.email,
      totalQuestions,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      percentage,
      date: new Date().toISOString(),
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/quizResults`,
        resultData
      );
      console.log("✅ Quiz result saved:", resultData);
    } catch (error) {
      console.error("❌ Error saving quiz result:", error);
    }
  };

  return (
    <motion.div
      className="relative min-h-screen flex flex-col items-center justify-start p-8 "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {submitted && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={400}
        />
      )}

      <motion.h2
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-center  bg-clip-text  drop-shadow-lg mb-8"
      >
        Interactive <span className="text-primary">Quiz</span>
      </motion.h2>

      {/* ✅ Floating Result Box (Top Right) */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ x: 150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed top-6 right-6 bg-white/60 :bg-gray-800/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-5 w-72 z-50"
          >
            <h3 className="text-xl font-bold text-indigo-600 mb-2 text-center">
              🎯 Your Result
            </h3>
            <p className="text-gray-800 :text-gray-200 text-center">
              <span className="font-semibold text-purple-600">{score}</span> /{" "}
              {quizzes.length}
            </p>
            <p className="text-center mt-2 text-green-600 font-semibold">
              {((score / quizzes.length) * 100).toFixed(2)}%
            </p>
            <div className="mt-3 text-sm text-gray-700 :text-gray-300 text-center">
              ✅ Correct: <span className="text-green-500">{score}</span> | ❌
              Wrong:{" "}
              <span className="text-red-500">{quizzes.length - score}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Progress Bar */}
      <div className="w-full max-w-3xl mb-6 mt-6">
        <div className="flex justify-between text-sm mb-1 font-semibold text-gray-700 :text-gray-200">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-300 :bg-gray-700 rounded-full h-3 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* ✅ Quiz Questions */}
      <div className="w-full max-w-7xl space-y-6">
        <AnimatePresence>
          {quizzes.map((q, i) => (
            <motion.div
              key={q._id}
              layout
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="backdrop-blur-lg rounded-2xl p-6 hover:shadow-2xl transition-all duration-300"
            >
              <p className="text-lg font-semibold mb-4 text-gray-800 :text-gray-200">
                {i + 1}. {q.question}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[q.option1, q.option2, q.option3, q.option4].map(
                  (opt, idx) => {
                    const selected = answers[q._id] === idx + 1;
                    const isCorrect = q.correct === (idx + 1).toString();
                    const isWrong =
                      submitted &&
                      selected &&
                      q.correct !== (idx + 1).toString();

                    let buttonStyle = "";

                    if (submitted) {
                      if (isCorrect)
                        buttonStyle =
                          "bg-green-500 text-white border-transparent shadow-lg";
                      else if (isWrong)
                        buttonStyle =
                          "bg-red-500 text-white border-transparent shadow-lg";
                      else
                        buttonStyle =
                          "bg-white :bg-gray-700 border-gray-300 :border-gray-500 opacity-70";
                    } else {
                      buttonStyle = selected
                        ? "bg-gradient-to-r from-green-400 to-green-600 text-white border-transparent shadow-lg"
                        : "bg-white :bg-gray-700 hover:bg-gray-100 :hover:bg-gray-600 border-gray-300 :border-gray-500";
                    }

                    return (
                      <motion.button
                        key={idx}
                        whileHover={!submitted ? { scale: 1.03 } : {}}
                        whileTap={!submitted ? { scale: 0.97 } : {}}
                        onClick={() => handleAnswer(q._id, idx + 1)}
                        disabled={submitted}
                        className={`flex items-center gap-3 py-3 px-4 rounded-xl text-left font-medium transition-all duration-300 border ${buttonStyle}`}
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
                  }
                )}
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
          className="btn btn-primary mt-10 px-10 py-4 font-bold text-lg rounded-full shadow-xl"
        >
          Submit Quiz
        </motion.button>
      )}
    </motion.div>
  );
};

export default TakeQuiz;
