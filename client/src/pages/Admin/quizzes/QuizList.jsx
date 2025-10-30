import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrashAlt, FaEye } from "react-icons/fa";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/quizzes`)
      .then((res) => setQuizzes(res.data))
      .catch((err) => console.error("Failed to load quizzes:", err));
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this quiz?");
    if (confirmDelete) {
      await axios.delete(`${import.meta.env.VITE_API_URL}/quizzes/${id}`);
      setQuizzes(quizzes.filter((q) => q._id !== id));
    }
  };

  const filteredQuizzes = quizzes.filter((q) =>
    q.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50"
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-3xl font-bold text-center mb-6"
      >
        Manage Quizzes
      </motion.h2>

      {/* 🔍 Search Bar */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search by question..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full max-w-sm rounded-full shadow-sm focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* 🧾 Quiz Table */}
      <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-200 bg-white">
        <table className="table table-zebra w-full">
          <thead className="text-sm uppercase">
            <tr>
              <th className="py-3 text-center">#</th>
              <th className="py-3">Question</th>
              <th className="py-3">Correct</th>
              <th className="py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuizzes.length > 0 ? (
              filteredQuizzes.map((q, i) => (
                <motion.tr
                  key={q._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-blue-50 transition-all duration-200"
                >
                  <td className="text-center font-semibold text-gray-600">
                    {i + 1}
                  </td>
                  <td className="font-medium text-gray-800">{q.question}</td>
                  <td className=" font-semibold">{q.correct}</td>
                  <td className="text-center flex justify-center gap-2">
                    {/* 👁️ View Button */}
                    <button
                      onClick={() => setSelectedQuiz(q)}
                      className="btn btn-sm btn-info text-white flex items-center gap-1 hover:scale-105 transition-transform duration-200"
                    >
                      <FaEye className="text-sm" /> View
                    </button>

                    {/* 🗑️ Delete Button */}
                    <button
                      onClick={() => handleDelete(q._id)}
                      className="btn btn-sm btn-error text-white flex items-center gap-1 hover:scale-105 transition-transform duration-200"
                    >
                      <FaTrashAlt className="text-sm" /> Delete
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No quizzes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 👁️ View Modal */}
      <AnimatePresence>
        {selectedQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white p-6 rounded-2xl shadow-2xl w-96 relative"
            >
              <h3 className="text-xl font-bold text-blue-700 mb-3 text-center">
                Quiz Details
              </h3>

              <div className="space-y-3 text-gray-700">
                <p>
                  <span className="font-semibold text-gray-900">Question:</span>{" "}
                  {selectedQuiz.question}
                </p>

                {/* 🟦 Options Display (4 Options Styled) */}
                <div className="grid grid-cols-1 gap-2 mt-2">
                  <div className="p-3 rounded-lg border border-gray-200 hover:bg-blue-50 transition">
                    <span className="font-medium text-gray-800">
                      A: {selectedQuiz.option1}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg border border-gray-200 hover:bg-blue-50 transition">
                    <span className="font-medium text-gray-800">
                      B: {selectedQuiz.option2}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg border border-gray-200 hover:bg-blue-50 transition">
                    <span className="font-medium text-gray-800">
                      C: {selectedQuiz.option3}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg border border-gray-200 hover:bg-blue-50 transition">
                    <span className="font-medium text-gray-800">
                      D: {selectedQuiz.option4}
                    </span>
                  </div>
                </div>

                {/* ✅ Correct Answer */}
                <p className="mt-3">
                  <span className="font-semibold text-gray-900">
                    Correct Answer:
                  </span>{" "}
                  <span className=" font-semibold">
                    {selectedQuiz.correct}
                  </span>
                </p>
              </div>

              <div className="mt-5 flex justify-center">
                <button
                  onClick={() => setSelectedQuiz(null)}
                  className="btn btn-sm btn-outline btn-primary rounded-full"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default QuizList;
