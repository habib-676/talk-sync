import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaSearch, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";

const AdminAllQuizResults = () => {
  const [results, setResults] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/quizResults`);
        setResults(res.data.data);
        setFiltered(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching results:", err);
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  // ✅ Search Filter
  useEffect(() => {
    const term = search.toLowerCase();
    const filteredData = results.filter(
      (r) =>
        r.email?.toLowerCase().includes(term) ||
        r.date?.toLowerCase().includes(term) ||
        r.percentage?.toString().includes(term) ||
        r.correctAnswers?.toString().includes(term)
    );
    setFiltered(filteredData);
  }, [search, results]);

  // ✅ Sort by percentage
  const handleSort = () => {
    const sorted = [...filtered].sort((a, b) =>
      sortOrder === "asc"
        ? parseFloat(a.percentage) - parseFloat(b.percentage)
        : parseFloat(b.percentage) - parseFloat(a.percentage)
    );
    setFiltered(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-gray-500">
        Loading quiz results...
      </div>
    );

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 :from-gray-900 :via-gray-800 :to-gray-900 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <motion.h2
        className="text-3xl font-bold text-center mb-8  bg-clip-text "
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        🧾 All Quiz Results
      </motion.h2>

      {/* ✅ Search and Sort Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-1/3">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by email, date, % or correct answers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered w-full pl-10 bg-white :bg-gray-800 :text-gray-200 border-gray-300 :border-gray-600"
          />
        </div>

        <button
          onClick={handleSort}
          className="btn btn-outline btn-primary flex items-center gap-2"
        >
          {sortOrder === "asc" ? (
            <>
              <FaSortAmountUp /> Sort by % (Low→High)
            </>
          ) : (
            <>
              <FaSortAmountDown /> Sort by % (High→Low)
            </>
          )}
        </button>
      </div>

      {/* ✅ Results Table */}
      <div className="overflow-x-auto rounded-2xl shadow-2xl bg-white/70 :bg-gray-800/60 backdrop-blur-md border border-gray-200 :border-gray-700">
        <table className="table w-full text-center">
          <thead className="  ">
            <tr>
              <th>#</th>
              <th>Email</th>
              <th>Total Questions</th>
              <th>Correct</th>
              <th>Wrong</th>
              <th>Percentage</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((res, index) => (
                <motion.tr
                  key={res._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="hover:bg-gray-100 :hover:bg-gray-700/50 transition-all duration-200"
                >
                  <td className="font-semibold text-gray-600 :text-gray-300">
                    {index + 1}
                  </td>
                  <td className="text-indigo-600 :text-indigo-400 font-medium">
                    {res.email}
                  </td>
                  <td>{res.totalQuestions}</td>
                  <td className="text-green-500 font-semibold">
                    {res.correctAnswers}
                  </td>
                  <td className="text-red-500 font-semibold">
                    {res.wrongAnswers}
                  </td>
                  <td
                    className={`font-bold ${parseFloat(res.percentage) >= 70
                        ? "text-green-600"
                        : parseFloat(res.percentage) >= 40
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                  >
                    {res.percentage}%
                  </td>
                  <td className="text-gray-500 :text-gray-300">
                    {new Date(res.date).toLocaleDateString()} <br />
                    <span className="text-xs text-gray-400">
                      {new Date(res.date).toLocaleTimeString()}
                    </span>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-10 text-gray-500 text-lg">
                  No results found 😞
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AdminAllQuizResults;
