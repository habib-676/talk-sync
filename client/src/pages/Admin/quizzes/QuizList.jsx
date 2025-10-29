import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    
  
    axios.get(`${import.meta.env.VITE_API_URL}/quizzes`).then((res) => setQuizzes(res.data));
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Delete this quiz?")) {
      await axios.delete(`${import.meta.env.VITE_API_URL}/quizzes/${id}`);
      setQuizzes(quizzes.filter((q) => q._id !== id));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <h2 className="text-2xl font-bold mb-4">Manage Quizzes</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Question</th>
              <th>Correct</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((q, i) => (
              <tr key={q._id}>
                <td>{i + 1}</td>
                <td>{q.question}</td>
                <td>{q.correct}</td>
                <td>
                  <button
                    onClick={() => handleDelete(q._id)}
                    className="btn btn-error btn-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <AdminAllQuizResults></AdminAllQuizResults> */}
      </div>
    </motion.div>
  );
};

export default QuizList;
