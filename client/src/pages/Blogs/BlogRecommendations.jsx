import { Link } from "react-router";
import { FcRight } from "react-icons/fc";
export default function BlogRecommendations() {
  const recommendations = [
    {
      id: 1,
      title: "Breaking the Fear: First Time Speaking with a Native",
      description:
        "Speaking with a native speaker for the very first time can feel overwhelming, but you’re not alone. This blog shares real learner stories, practical tips, and confidence-boosting exercises to help you break through anxiety. By the end, you’ll see that mistakes are part of learning and a key step toward fluency.",
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
        "Gamification isn’t just a buzzword—it’s a proven way to keep learners motivated. In this blog, we explore how badges in Talksync celebrate your milestones, encourage consistency, and transform small wins into lasting progress. You’ll discover the psychology behind why these little rewards push learners to keep going.",
      readingTime: "4 min read",
      author: "Talksync Research",
      image: "https://i.ibb.co.com/5hRnJWd3/undraw-creative-flow-t3kz.png",
    },
    {
      id: 4,
      title: "Language Exchange vs Traditional Classes",
      description:
        "Should you choose a classroom or a peer-to-peer exchange? This post compares the strengths and limitations of both methods, from structured lessons to real-life conversations. By weighing flexibility, cost, and learning style, you’ll be able to decide which approach fits your fluency goals best.",
      readingTime: "7 min read",
      author: "David Kim",
      image: "https://i.ibb.co.com/bnG4PXM/undraw-youtube-tutorial-xgp1.png",
    },
    {
      id: 5,
      title: "How to Make Online Sessions Engaging",
      description:
        "Virtual lessons can easily feel dull if they lack energy and structure. This article introduces creative ways to make online sessions interactive, including language games, roleplay scenarios, and fun prompts. Whether you’re a tutor or a learner, these strategies will help keep conversations lively and effective.",
      readingTime: "5 min read",
      author: "Talksync Tutors",
      image: "https://i.ibb.co.com/67vmWjSB/undraw-online-learning-tgmv.png",
    },
    {
      id: 6,
      title: "Success Story: From Beginner to Fluent in One Year",
      description:
        "Fluency in just twelve months sounds impossible—but this inspiring learner’s journey proves otherwise. Starting with only basic greetings, they committed to daily practice, overcame self-doubt, and built confidence step by step. This story shows that with dedication and the right tools, fast progress is within reach.",
      readingTime: "8 min read",
      author: "Community Spotlight",
      image: "https://i.ibb.co.com/60Lh6ngW/undraw-winners-fre4.png",
    },
  ];

  return (
    <section className="my-10 px-6 lg:px-20">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10">
  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500">
    Handpicked 
  </span>{" "}
  Reads for You
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
              <h3 className="text-lg font-semibold text-accent mb-2">
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
