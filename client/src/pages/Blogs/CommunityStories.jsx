export default function CommunityStories() {
  const stories = [
    {
      id: 1,
      name: "Anna Lopez",
      photo: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe",
      nativeIcon: "🇪🇸", // Spain
      learningIcon: "🇯🇵", // Japan
      snippet: "I never thought I’d enjoy kanji until my partner made it fun!",
      tags: ["Motivation", "LanguageJourney", "SuccessStory"],
    },
    {
      id: 2,
      name: "David Kim",
      photo: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
      nativeIcon: "🇰🇷", // South Korea
      learningIcon: "🇫🇷", // France
      snippet: "Accidentally ordered 10 croissants instead of 1… unforgettable!",
      tags: ["Funny", "CultureMixup"],
    },
    {
      id: 3,
      name: "Sara Ali",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
      nativeIcon: "🇵🇰", // Pakistan
      learningIcon: "🇩🇪", // Germany
      snippet: "From zero German to holding work meetings in 6 months!",
      tags: ["Inspiration", "Learning"],
    },
  ];

  return (
    <section className="mt-8 bg-gray-50 py-12 px-6 lg:px-20">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <h2 className="text-3xl font-bold text-indigo-700 mb-6">
            Language Stories from the Community
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition"
              >
                <div className="flex items-center space-x-4 mb-3">
                  <img
                    src={story.photo}
                    alt={story.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{story.name}</p>
                    <div className="flex items-center gap-2 text-xl text-gray-600">
                      <span>{story.nativeIcon}</span> <span>→</span> <span>{story.learningIcon}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">{story.snippet}</p>
                <div className="flex flex-wrap gap-2">
                  {story.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="bg-gradient-to-br from-yellow-100 to-yellow-300 rounded-2xl p-6 shadow-md">
          <h3 className="text-xl font-bold text-yellow-800 mb-4">
            ⭐ Top Feedback of the Month
          </h3>
          <blockquote className="italic text-gray-700">
            “Talksync helped me gain confidence speaking French with real people.”
          </blockquote>
          <p className="mt-4 text-sm font-semibold text-gray-800">— Maria Gomez</p>
          <div className="mt-2 text-yellow-600">★★★★★</div>
        </aside>
      </div>
    </section>
  );
}
