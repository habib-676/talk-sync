import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
// import axios from "axios";
import {
  FaQuestionCircle,
  FaPlusCircle,
  FaCheckCircle,
  FaMagic,
} from "react-icons/fa";

import axios from "axios";

const AddQuiz = () => {
  const { register, handleSubmit, reset, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/admin/quizzes`, data);
      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 2500);
    } catch (error) {
      alert("❌ Failed to add quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Live watch fields
  const question = watch("question");
  const options = [watch("option1"), watch("option2"), watch("option3"), watch("option4")];
  const correct = watch("correct");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="  flex flex-col items-center justify-center p-6 relative overflow-hidden"
    >
      {/* Floating Glass Blobs */}
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
        className="absolute  right-10 w-36 h-36 bg-indigo-400/30 rounded-full blur-3xl"
      ></motion.div>
      <motion.div
        animate={{ y: [0, -25, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="absolute bottom-2 left-16 w-48 h-48 bg-purple-400/25 rounded-full blur-3xl"
      ></motion.div>

      {/* Header */}
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl md:text-3xl font-bold text-center mb-10  flex items-center gap-3 z-10"
      >
        <FaQuestionCircle className="text-indigo-600 animate-pulse" />
        Create New Quiz
      </motion.h2>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full max-w-6xl z-10">
        {/* --- Left: Quiz Form --- */}
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card bg-white/80 backdrop-blur-xl border border-indigo-100 shadow-2xl hover:shadow-indigo-200/70 transition-all duration-500"
        >
          <div className="card-body">
            <h3 className="text-2xl font-semibold text-indigo-700 mb-4 flex items-center gap-2">
              <FaMagic className="text-indigo-500" /> Quiz Details
            </h3>

            <div className="space-y-4">
              <input
                {...register("question")}
                placeholder="Enter quiz question..."
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {[1, 2, 3, 4].map((n) => (
                <input
                  key={n}
                  {...register(`option${n}`)}
                  placeholder={`Option ${n}`}
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              ))}
              <input
                {...register("correct")}
                type="number"
                min="1"
                max="4"
                placeholder="Correct option (1–4)"
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full flex items-center justify-center gap-2 text-lg mt-3"
              >
                <FaPlusCircle /> {loading ? "Adding..." : "Add Quiz"}
              </motion.button>

              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="alert alert-success mt-5 flex items-center gap-2 text-sm"
                >
                  <FaCheckCircle />
                  <span>Quiz added successfully!</span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.form>

        {/* --- Right: Live Preview --- */}
        <motion.div
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="card bg-white/80 backdrop-blur-xl border border-purple-100 shadow-2xl hover:shadow-purple-200/70 transition-all duration-500"
        >
          <div className="card-body">
            <h3 className="text-2xl font-semibold text-purple-700 mb-4">
              👁️ Live Preview
            </h3>

            {question ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <p className="text-lg font-medium text-gray-800 bg-base-100 p-4 rounded-xl shadow-inner">
                  {question}
                </p>

                <ul className="space-y-3">
                  {options.map(
                    (opt, index) =>
                      opt && (
                        <motion.li
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          className={`p-4 rounded-xl border transition-all duration-300 ${
                            Number(correct) === index + 1
                              ? "bg-green-100 border-green-400 text-green-700 shadow-md"
                              : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          {index + 1}. {opt}
                        </motion.li>
                      )
                  )}
                </ul>
              </motion.div>
            ) : (
              <div className="text-gray-400 italic text-center py-20">
                Start typing a question to preview it here...
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AddQuiz;
