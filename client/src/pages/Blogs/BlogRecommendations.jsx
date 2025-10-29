import { Link } from "react-router";
import { motion } from "framer-motion";
import { FaBookOpen, FaClock, FaUser } from "react-icons/fa";

export default function BlogRecommendations() {
  const recommendations = [
    {
      id: 1,
      title: "How to Build Daily Language Habits That Stick",
      description:
        "Learn powerful methods to turn language learning into a daily habit you actually enjoy. We cover habit stacking, motivation triggers, and mindset shifts.",
      readingTime: "6 min read",
      author: "Talksync Team",
      image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=900&q=80",
    },
    {
      id: 2,
      title: "The Art of Listening: Becoming Fluent Through Conversation",
      description:
        "Fluency isn’t only about speaking—it’s about understanding. Discover proven strategies to sharpen your listening and decode meaning faster.",
      readingTime: "5 min read",
      author: "Maria Gomez",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&q=80",
    },
    {
      id: 3,
      title: "Motivation vs Consistency: What Actually Drives Progress",
      description:
        "Find out why consistency beats motivation every time, and how to stay on track even on low-energy days. Simple tips for long-term success.",
      readingTime: "7 min read",
      author: "David Kim",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80",
    },
    {
      id: 4,
      title: "Top 5 Apps to Boost Your Speaking Confidence",
      description:
        "From Talksync to pronunciation trainers—these apps can transform your learning experience and help you speak confidently anywhere.",
      readingTime: "4 min read",
      author: "Talksync Research",
      image: "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=900&q=80",
    },
    {
      id: 5,
      title: "Cultural Intelligence: The Secret to Real Communication",
      description:
        "Speaking fluently isn’t enough—understanding culture builds connection. Learn how to avoid missteps and communicate naturally across borders.",
      readingTime: "8 min read",
      author: "Community Spotlight",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&q=80",
    },
    {
      id: 6,
      title: "Success Story: How Small Wins Create Big Progress",
      description:
        "One learner’s inspiring story on how celebrating tiny achievements turned fear into confidence and built unstoppable momentum.",
      readingTime: "6 min read",
      author: "Talksync Tutors",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&q=80",
    },
  ];

  return (
    <section className="my-14 px-6 lg:px-20">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 tracking-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500">
          Handpicked
        </span>{" "}
        Reads for You
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {recommendations.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Link
              to={`/blogs/${item.id}`}
              className="group block bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden border border-gray-100 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {item.description}
                </p>

                <div className="flex items-center justify-between text-xs text-indigo-500 font-medium">
                  <p className="flex items-center gap-1">
                    <FaClock /> {item.readingTime}
                  </p>
                  <p className="flex items-center gap-1 text-gray-500">
                    <FaUser /> {item.author}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
