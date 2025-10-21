import React from 'react';
import { BookOpen, GraduationCap, Globe2 } from "lucide-react";
const IntroCourse = () => {
    return (
        <div>
             <section className="p-6 lg:p-10">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-3xl font-bold text-blue-600 flex justify-center items-center gap-2">
          <GraduationCap size={28} />
          Master New Languages with Expert-Led Courses
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-3">
          Unlock your fluency potential through interactive lessons designed by
          professional tutors. Learn to speak confidently through real-world
          dialogues, vocabulary challenges, and cultural insights — all tailored
          to your level and pace.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl shadow-md bg-white dark:bg-gray-800 hover:shadow-lg transition">
          <BookOpen size={30} className="text-blue-500 mb-3" />
          <h3 className="font-semibold text-lg mb-2">Interactive Lessons</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Dive into engaging lessons combining grammar, pronunciation, and
            practical exercises that make learning natural and fun.
          </p>
        </div>

        <div className="p-6 rounded-2xl shadow-md bg-white dark:bg-gray-800 hover:shadow-lg transition">
          <Globe2 size={30} className="text-green-500 mb-3" />
          <h3 className="font-semibold text-lg mb-2">Global Tutors</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Learn directly from certified tutors around the world and gain
            authentic accents, cultural understanding, and personalized feedback.
          </p>
        </div>

        <div className="p-6 rounded-2xl shadow-md bg-white dark:bg-gray-800 hover:shadow-lg transition">
          <GraduationCap size={30} className="text-purple-500 mb-3" />
          <h3 className="font-semibold text-lg mb-2">Track Your Progress</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor your progress, earn digital badges, and unlock new levels as
            you improve your language skills step by step.
          </p>
        </div>
      </div>
    </section>
        </div>
    );
};

export default IntroCourse;