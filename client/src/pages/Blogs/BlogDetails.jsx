import { useParams } from "react-router";
import { motion } from "framer-motion";
import { FaUserEdit, FaClock, FaFeatherAlt } from "react-icons/fa";

export default function BlogDetails() {
  const { id } = useParams();

  const blogs = [
    {
      id: 1,
      title: "How to Build Daily Language Habits That Stick",
      description:
        "Learn how to stay consistent in your language journey with small, meaningful steps that fit naturally into your lifestyle.",
      content:
        "The secret to mastering any language lies not in intensity, but in consistency. Start with short, achievable goals and tie your practice to existing habits—like listening to a short podcast while having coffee. Over time, your brain builds familiarity, and what once felt forced becomes natural. Reward yourself for small wins, and remember: momentum grows with every day you show up.",
      readingTime: "6 min read",
      author: "Talksync Team",
      image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=900&q=80",
    },
    {
      id: 2,
      title: "The Art of Listening: Becoming Fluent Through Conversation",
      description:
        "Listening well is the key to speaking naturally. This article explores techniques to sharpen your ears and boost comprehension.",
      content:
        "Most learners focus heavily on speaking but underestimate listening. Train your ear by shadowing native speakers, paying attention to rhythm, and predicting meaning from context. Don’t stress over understanding every word—focus on flow. The more you listen actively, the faster your responses will feel automatic and natural.",
      readingTime: "5 min read",
      author: "Maria Gomez",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&q=80",
    },
    {
      id: 3,
      title: "Motivation vs Consistency: What Actually Drives Progress",
      description:
        "We often chase motivation, but it’s consistency that delivers results. Here’s how to build steady progress even when inspiration fades.",
      content:
        "Motivation is a spark—consistency is the fire that keeps burning. Don’t wait for perfect conditions; show up imperfectly but regularly. Build systems: a schedule, a progress tracker, or an accountability partner. When effort becomes a routine, success becomes inevitable.",
      readingTime: "7 min read",
      author: "David Kim",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80",
    },
    {
      id: 4,
      title: "Top 5 Apps to Boost Your Speaking Confidence",
      description:
        "Technology can accelerate your progress. Discover 5 tools that make speaking practice interactive, fun, and confidence-building.",
      content:
        "Apps like Talksync, HelloTalk, and Elsa use AI to give real-time feedback, pronunciation analysis, and peer interaction. Combine digital tools with real human conversation, and you’ll see results faster. Remember, tech is a support system, not a replacement for genuine connection.",
      readingTime: "4 min read",
      author: "Talksync Research",
      image: "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=900&q=80",
    },
    {
      id: 5,
      title: "Cultural Intelligence: The Secret to Real Communication",
      description:
        "Understanding culture enhances fluency. Learn how to build trust and connect beyond words through cultural awareness.",
      content:
        "True communication goes beyond vocabulary. Learn the cultural context—body language, tone, humor, and etiquette. When you connect respectfully with different perspectives, your confidence and empathy grow alongside your language skills.",
      readingTime: "8 min read",
      author: "Community Spotlight",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&q=80",
    },
    {
      id: 6,
      title: "Success Story: How Small Wins Create Big Progress",
      description:
        "Meet a Talksync learner who went from hesitant beginner to confident speaker by celebrating small milestones every week.",
      content:
        "Progress isn’t a straight line—it’s a series of small climbs. By acknowledging each step, you create motivation loops that push you forward. This learner tracked weekly wins, shared them with peers, and turned self-doubt into pride. Remember: small wins compound into big success.",
      readingTime: "6 min read",
      author: "Talksync Tutors",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&q=80",
    },
  ];

  const blog = blogs.find((b) => b.id === parseInt(id));
  if (!blog)
    return <p className="text-center text-gray-600 mt-10">Blog not found</p>;

  return (
    <section className="px-4 md:px-10 lg:px-24 mt-20 mb-20 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full overflow-hidden rounded-3xl shadow-lg mb-10 group"
      >
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-80 md:h-96 object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl md:text-5xl font-extrabold leading-snug mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500"
      >
        {blog.title}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-500 mb-10"
      >
        <div className="flex items-center gap-2">
          <FaUserEdit className="text-indigo-500" />
          <span className="font-semibold text-gray-700">{blog.author}</span>
        </div>
        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
        <div className="flex items-center gap-2">
          <FaClock className="text-pink-500 text-xl" />
          <span>{blog.readingTime}</span>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-gray-700 leading-relaxed text-base md:text-lg mb-6 border-l-4 border-indigo-400 pl-4 italic"
      >
        {blog.description}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-gray-800 leading-relaxed text-base md:text-lg tracking-wide"
      >
        {blog.content}
      </motion.p>
    </section>
  );
}
