import { useParams } from "react-router";


export default function BlogDetails() {
  const { id } = useParams();

  // Static data 
  const blogs = [
    {
      id: 1,
      title: "Breaking the Fear: First Time Speaking with a Native",
      description:
        "Tips and real stories on overcoming anxiety during your first language exchange.",
      content:
        "Speaking with a native speaker for the first time can feel intimidating. Here are some practical steps and inspiring stories from learners who overcame their fear...",
      readingTime: "5 min read",
      author: "Talksync Team",
      image: "https://i.ibb.co.com/5W5Mdfnt/undraw-conference-speaker-kl0d.png",
    },
    {
      id: 2,
      title: "5 Cultural Mistakes Learners Often Make",
      description:
        "Learn common cultural misunderstandings and how to avoid them while practicing.",
      content:
        "When practicing a new language, cultural awareness is just as important as grammar. These five common mistakes can easily be avoided if you know what to look for...",
      readingTime: "6 min read",
      author: "Maria Gomez",
      image: "https://i.ibb.co.com/rKMNpkrT/undraw-online-community-3o0l.png",
    },
    {
      id: 3,
      title: "Why Badges Keep You Motivated in Talksync",
      description:
        "Gamification isn’t just a buzzword—it’s a proven way to keep learners motivated. In this blog, we explore how badges in Talksync celebrate your milestones, encourage consistency, and transform small wins into lasting progress. You’ll discover the psychology behind why these little rewards push learners to keep going.",
      content:
        "Badges are more than just icons – they trigger motivation by rewarding small, consistent progress. Here’s how gamification boosts your learning journey...",
      readingTime: "4 min read",
      author: "Talksync Research",
      image: "https://i.ibb.co.com/5hRnJWd3/undraw-creative-flow-t3kz.png",
    },
    {
      id: 4,
      title: "Language Exchange vs Traditional Classes",
      description:
        "Should you choose a classroom or a peer-to-peer exchange? This post compares the strengths and limitations of both methods, from structured lessons to real-life conversations. By weighing flexibility, cost, and learning style, you’ll be able to decide which approach fits your fluency goals best.",
      content:
        "Both traditional classes and peer-to-peer exchanges have pros and cons. This post breaks them down so you can choose the best fit for your goals...",
      readingTime: "7 min read",
      author: "David Kim",
      image: "https://i.ibb.co.com/bnG4PXM/undraw-youtube-tutorial-xgp1.png",
    },
    {
      id: 5,
      title: "How to Make Online Sessions Engaging",
      description:
        "Virtual lessons can easily feel dull if they lack energy and structure. This article introduces creative ways to make online sessions interactive, including language games, roleplay scenarios, and fun prompts. Whether you’re a tutor or a learner, these strategies will help keep conversations lively and effective.",
      content:
        "Online sessions can feel boring if not structured well. Here are proven strategies to keep learners active and motivated during virtual practice...",
      readingTime: "5 min read",
      author: "Talksync Tutors",
      image: "https://i.ibb.co.com/67vmWjSB/undraw-online-learning-tgmv.png",
    },
    {
      id: 6,
      title: "Success Story: From Beginner to Fluent in One Year",
      description:
        "Fluency in just twelve months sounds impossible—but this inspiring learner’s journey proves otherwise. Starting with only basic greetings, they committed to daily practice, overcame self-doubt, and built confidence step by step. This story shows that with dedication and the right tools, fast progress is within reach.",
      content:
        "Achieving fluency in a year may sound impossible, but with dedication and the right tools, it’s doable. This learner’s story will inspire you to push through...",
      readingTime: "8 min read",
      author: "Community Spotlight",
      image: "https://i.ibb.co.com/60Lh6ngW/undraw-winners-fre4.png",
    },
  ];

  const blog = blogs.find((b) => b.id === parseInt(id));

  if (!blog)
    return (
      <p className="text-center text-gray-600 mt-10">Blog not found</p>
    );

  return (
   <section className="px-4 md:px-10 lg:px-24 mt-20 mb-20 max-w-5xl mx-auto">
      {/* Blog Image */}
      <div className="w-full overflow-hidden rounded-2xl shadow-md mb-8">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-84 md:h-96 object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Blog Title */}
      <h1 className="text-2xl md:text-4xl font-extrabold text-accent mb-4 leading-snug">
        {blog.title}
      </h1>

      {/* Author & Time */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-6">
        <span className="font-medium">{blog.author}</span>
        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
        <span>{blog.readingTime}</span>
      </div>
<p className="text-gray-700 leading-relaxed text-base md:text-lg">
        {blog.description}
      </p>
      {/* Blog Content */}
      <p className="text-gray-700 leading-relaxed text-base md:text-lg">
        {blog.content}
      </p>
    </section>
  );
}
