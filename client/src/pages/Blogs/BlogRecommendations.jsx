import { Link } from "react-router";
import { FcRight } from "react-icons/fc";
export default function BlogRecommendations() {
  const recommendations = [
    {
      id: 1,
      title: "Breaking the Fear: First Time Speaking with a Native",
      description:
        "Tips and real stories on overcoming anxiety during your first language exchange.",
      readingTime: "5 min read",
      author: "Talksync Team",
      image: "https://i.ibb.co.com/5W5Mdfnt/undraw-conference-speaker-kl0d.png",
    },
    {
      id: 2,
      title: "5 Cultural Mistakes Learners Often Make",
      description:
        "Learn common cultural misunderstandings and how to avoid them while practicing.",
      readingTime: "6 min read",
      author: "Maria Gomez",
      image: "https://i.ibb.co.com/rKMNpkrT/undraw-online-community-3o0l.png",
    },
    {
      id: 3,
      title: "Why Badges Keep You Motivated in Talksync",
      description:
        "Explore the psychology of gamification and why small achievements matter.",
      readingTime: "4 min read",
      author: "Talksync Research",
      image: "https://i.ibb.co.com/5hRnJWd3/undraw-creative-flow-t3kz.png",
    },
    {
      id: 4,
      title: "Language Exchange vs Traditional Classes",
      description:
        "Which method works better for fluency? We compare classroom vs peer practice.",
      readingTime: "7 min read",
      author: "David Kim",
      image: "https://i.ibb.co.com/bnG4PXM/undraw-youtube-tutorial-xgp1.png",
    },
    {
      id: 5,
      title: "How to Make Online Sessions Engaging",
      description:
        "Use games, prompts, and roleplay to keep your conversations lively and effective.",
      readingTime: "5 min read",
      author: "Talksync Tutors",
      image: "https://i.ibb.co.com/67vmWjSB/undraw-online-learning-tgmv.png",
    },
    {
      id: 6,
      title: "Success Story: From Beginner to Fluent in One Year",
      description:
        "Read how one learner went from basic greetings to fluent conversation in Japanese.",
      readingTime: "8 min read",
      author: "Community Spotlight",
      image: "https://i.ibb.co.com/60Lh6ngW/undraw-winners-fre4.png",
    },
  ];

  return (
    <section className="mt-10 px-6 lg:px-20">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">
        Recommended for You
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((item) => (
          <Link
            to={`/blogs/${item.id}`}
            key={item.id}
            className="block bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
          >
            {/* Blog Image */}
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-100 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3">{item.description}</p>
             <p className="flex items-center gap-1 text-xs text-indigo-500 font-medium">
  {item.readingTime}
  <FcRight className="text-sm" />
</p>

            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
