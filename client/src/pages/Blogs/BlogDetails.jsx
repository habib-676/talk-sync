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
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
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
      image: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe",
    },
    {
      id: 3,
      title: "Why Badges Keep You Motivated in Talksync",
      description:
        "Explore the psychology of gamification and why small achievements matter.",
      content:
        "Badges are more than just icons – they trigger motivation by rewarding small, consistent progress. Here’s how gamification boosts your learning journey...",
      readingTime: "4 min read",
      author: "Talksync Research",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    },
    {
      id: 4,
      title: "Language Exchange vs Traditional Classes",
      description:
        "Which method works better for fluency? We compare classroom vs peer practice.",
      content:
        "Both traditional classes and peer-to-peer exchanges have pros and cons. This post breaks them down so you can choose the best fit for your goals...",
      readingTime: "7 min read",
      author: "David Kim",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    },
    {
      id: 5,
      title: "How to Make Online Sessions Engaging",
      description:
        "Use games, prompts, and roleplay to keep your conversations lively and effective.",
      content:
        "Online sessions can feel boring if not structured well. Here are proven strategies to keep learners active and motivated during virtual practice...",
      readingTime: "5 min read",
      author: "Talksync Tutors",
      image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167",
    },
    {
      id: 6,
      title: "Success Story: From Beginner to Fluent in One Year",
      description:
        "Read how one learner went from basic greetings to fluent conversation in Japanese.",
      content:
        "Achieving fluency in a year may sound impossible, but with dedication and the right tools, it’s doable. This learner’s story will inspire you to push through...",
      readingTime: "8 min read",
      author: "Community Spotlight",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
    },
  ];

  const blog = blogs.find((b) => b.id === parseInt(id));

  if (!blog)
    return (
      <p className="text-center text-gray-600 mt-10">Blog not found</p>
    );

  return (
    <section className=" px-6 lg:px-20 mt-20">
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-64 object-cover rounded-xl mb-6"
      />
      <h1 className="text-3xl font-bold text-indigo-700 mb-4">{blog.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {blog.author} · {blog.readingTime}
      </p>
      <p className="text-gray-700 leading-relaxed">{blog.content}</p>
    </section>
  );
}
