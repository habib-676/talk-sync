import React from "react";
import {
  BookOpen,
  GraduationCap,
  Globe2,
  Mic,
  Sparkles,
  Users,
} from "lucide-react";

const IntroCourse = () => {
  const features = [
    {
      icon: <BookOpen size={36} className="text-blue-500 group-hover:text-white" />,
      title: "Interactive Learning Paths",
      desc: "Experience a structured yet flexible curriculum blending grammar, listening, and conversation in immersive ways.",
      gradient: "from-blue-500/10 to-blue-600/20 hover:from-blue-500 hover:to-blue-600",
    },
    {
      icon: <Globe2 size={36} className="text-green-500 group-hover:text-white" />,
      title: "Global Certified Tutors",
      desc: "Connect with expert tutors from across the globe and gain cultural fluency along with real conversational confidence.",
      gradient: "from-green-500/10 to-green-600/20 hover:from-green-500 hover:to-green-600",
    },
    {
      icon: <Mic size={36} className="text-orange-500 group-hover:text-white" />,
      title: "Speak with Confidence",
      desc: "Practice through real-world dialogues, pronunciation drills, and feedback sessions to master natural speaking flow.",
      gradient: "from-orange-500/10 to-orange-600/20 hover:from-orange-500 hover:to-orange-600",
    },
    {
      icon: <Users size={36} className="text-purple-500 group-hover:text-white" />,
      title: "Community Support",
      desc: "Join live group discussions, language challenges, and peer reviews to learn collaboratively with other learners.",
      gradient: "from-purple-500/10 to-purple-600/20 hover:from-purple-500 hover:to-purple-600",
    },
    {
      icon: <GraduationCap size={36} className="text-pink-500 group-hover:text-white" />,
      title: "Smart Progress Tracking",
      desc: "Visualize your achievements, unlock new skill levels, and stay motivated with personalized learning analytics.",
      gradient: "from-pink-500/10 to-pink-600/20 hover:from-pink-500 hover:to-pink-600",
    },
    {
      icon: <Sparkles size={36} className="text-yellow-500 group-hover:text-white" />,
      title: "Cultural Immersion",
      desc: "Explore cultural idioms, expressions, and lifestyle tips from native speakers to learn beyond the textbook.",
      gradient: "from-yellow-500/10 to-yellow-600/20 hover:from-yellow-500 hover:to-yellow-600",
    },
  ];

  return (
    <section className="py-16 px-6 lg:px-12 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <h2 className="flex items-center justify-center gap-3 text-3xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 leading-tight">
  <span className="flex items-center justify-center">
    <GraduationCap size={32} className="" />
  </span>
  <span>Master New Languages with Expert-Led Courses</span>
</h2>

        <p className="text-gray-600 dark:text-gray-300 mt-4 text-lg leading-relaxed">
          Transform your learning journey with interactive lessons, real
          conversations, and AI-assisted practice tools. Learn at your own pace
          with professional guidance and global exposure.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((item, idx) => (
          <div
            key={idx}
            className={`group relative bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-2 transform transition-all duration-500 border border-transparent hover:border-blue-400/50 bg-gradient-to-br ${item.gradient}`}
          >
            <div className="mb-5 transform group-hover:scale-110 transition-transform duration-500">
              {item.icon}
            </div>
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">
              {item.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {item.desc}
            </p>

            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <Sparkles className="text-blue-400 animate-pulse" size={20} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default IntroCourse;
