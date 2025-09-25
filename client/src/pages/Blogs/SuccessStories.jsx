import { FiHeart } from "react-icons/fi";

export default function SuccessStoriesSection() {
  const cards = [
    // Row 1: image, text, image, text
    {
      id: 1,
      type: "image",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80",
      alt: "student writing in class",
    },
    {
      id: 2,
      type: "text",
      title: "From Fear to Fluency: My First English Presentation",
      snippet:
        "When I first stood in front of my classmates, my hands were shaking. But after weeks of practice, I delivered a 5-minute presentation confidently. That moment taught me that fluency is not about perfection, but about courage.",
      author: "Anna Ruiz",
      categories: ["Confidence, Public Speaking"],
      likes: 70,
    },
    {
      id: 3,
      type: "image",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&q=80",
      alt: "male student smiling with a folder",
    },
    {
      id: 4,
      type: "text",
      title: "From 🇪🇸 Spanish to 🇯🇵 Japanese: My Kanji Adventure",
      snippet:
        "I started learning Japanese with a Spanish partner. At first, kanji looked impossible, but my partner taught me through anime and food menus. Now I can read signs in Tokyo!",
      author: "Steven Master",
      categories: ["Motivation, Language Exchange"],
      likes: 47,
    },

    // Row 2: text, image, text, image
    {
      id: 5,
      type: "text",
      title: "From 🇹🇷 Turkish to 🇫🇷 French: Market Conversations",
      snippet:
        "My exchange partner and I role-played shopping dialogues. It was funny when I confused “fish” with “peach,” but it made the session unforgettable.",
      author: "Steven Master",
      categories: ["Real Life Practice, Humor"],
      likes: 55,
    },
    {
      id: 6,
      type: "image",
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1200&q=80",
      alt: "students in campus hallway",
    },
    {
      id: 7,
      type: "text",
      title: "🇵🇰 Urdu Meets 🇩🇪 German: Work Meetings in Two Languages",
      snippet:
        "I joined Talksync to improve my German for work. Practicing with a native speaker helped me run my first bilingual team meeting — a proud moment!",
      author: "Steven Master",
      categories: ["Professional Growth, Success Story"],
      likes: 60,
    },
    {
      id: 8,
      type: "image",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&q=80",
      alt: "students smiling at class table",
    },
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10">
  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500">
    Learners’ Journeys
  </span>
</h2>
        {/* 4-columns on md+, 2 on sm, 1 on xs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {cards.map((c) =>
            c.type === "image" ? (
              <div
                key={c.id}
                className="overflow-hidden rounded-md bg-white shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={c.image}
                  alt={c.alt || "story image"}
                  className="w-full h-[20rem] object-cover"
                />
              </div>
            ) : (
              <article
                key={c.id}
                className="rounded-md bg-white p-6 min-h-[20rem] flex flex-col justify-between shadow-sm hover:shadow-lg transition-transform transition-shadow duration-300 hover:-translate-y-1"
                role="article"
              >
                <header>
                  {/* Small uppercased title like the reference */}
                  <h3 className="text-base font-semibold uppercase text-accent mb-3">
                    {c.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {c.snippet}
                  </p>
                </header>

                <footer className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <div>
                    <div className="text-xs text-gray-400">by</div>
                    <div className="text-indigo-600 font-medium">{c.author}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      in{" "}
                      {c.categories.map((cat, i) => (
                        <span key={cat} className="text-indigo-600">
                          {cat}
                          {i < c.categories.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-sm">{c.likes}</span>
                    <FiHeart className="w-5 h-5" />
                  </div>
                </footer>
              </article>
            )
          )}
        </div>
      </div>
    </section>
  );
}
