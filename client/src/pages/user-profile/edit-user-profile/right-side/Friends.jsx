import { Eye, UserRoundMinus, MessageCircle, Circle } from "lucide-react"; // Removed UserX as UserRoundMinus is more specific
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // Enhanced mock data with online status
  const mockFriends = [
    {
      id: 1,
      name: "Miguel Rodriguez",
      nativeLanguage: "Spanish", // Corrected from Japanese to Spanish based on typical names
      photo:
        "https://res.cloudinary.com/dnh9rdh01/image/upload/v1756112807/rlhh0w8p5tizu61g7fin.jpg",
      learningLanguages: ["English", "Japanese"],
      level: "Intermediate",
      lastActive: "2 hours ago",
      isOnline: false,
    },
    {
      id: 2,
      name: "Sarah Chen",
      nativeLanguage: "Mandarin",
      photo:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      learningLanguages: ["French", "Korean"],
      level: "Advanced",
      lastActive: "5 minutes ago",
      isOnline: true,
    },
    {
      id: 3,
      name: "Ahmed Al-Farsi",
      nativeLanguage: "Arabic",
      photo: "https://randomuser.me/api/portraits/men/32.jpg",
      learningLanguages: ["English"],
      level: "Beginner",
      lastActive: "1 day ago",
      isOnline: false,
    },
    {
      id: 4,
      name: "Maria Schmidt",
      nativeLanguage: "German",
      photo: "https://randomuser.me/api/portraits/women/44.jpg",
      learningLanguages: ["Spanish"],
      level: "Upper-Intermediate",
      lastActive: "Online",
      isOnline: true,
    },
    {
      id: 5,
      name: "Kenji Tanaka",
      nativeLanguage: "Japanese",
      photo: "https://randomuser.me/api/portraits/men/70.jpg",
      learningLanguages: ["English", "Mandarin"],
      level: "Fluent",
      lastActive: "30 minutes ago",
      isOnline: true,
    },
  ];

  useEffect(() => {
    // Simulate fetching friends data
    const fetchFriends = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        setTimeout(() => {
          setFriends(mockFriends);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching friends:", error);
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  const handleUnfriend = async (friendId, friendName) => {
    if (!window.confirm(`Are you sure you want to unfriend ${friendName}?`))
      return;

    try {
      // TODO: Implement API call to remove friend
      // const res = await api.delete(`/api/users/friends/${friendId}`);
      // if (res.success) {
      setFriends((prev) => prev.filter((friend) => friend.id !== friendId));
      toast.success(`${friendName} has been unfriended.`);
      // }
    } catch (error) {
      console.error("Error removing friend:", error);
      toast.error(`Failed to unfriend ${friendName}.`);
    }
  };

  const handleMessage = (friendId, friendName) => {
    // TODO: Implement navigation to chat page/modal
    console.log("Start chat with:", friendId);
    toast.info(`Opening chat with ${friendName}...`);
  };

  const displayedFriends = showAll ? friends : friends.slice(0, 3); // Display max 3 by default

  return (
    <section className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Friends ({friends.length})
      </h2>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="skeleton w-12 h-12 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-3/4 rounded-md"></div>
                <div className="skeleton h-3 w-1/2 rounded-md"></div>
              </div>
            </div>
          ))}
        </div>
      ) : friends.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p>No friends yet. Start connecting!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedFriends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="relative">
                  <img
                    src={friend.photo}
                    alt={friend.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div
                    className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      friend.isOnline ? "bg-green-500" : "bg-gray-400"
                    }`}
                    title={
                      friend.isOnline
                        ? "Online"
                        : `Last seen ${friend.lastActive}`
                    }
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {friend.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Native {friend.nativeLanguage}
                    {friend.learningLanguages.length > 0 &&
                      ` | Learning: ${friend.learningLanguages.join(", ")}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    Level: {friend.level}
                    {!friend.isOnline && ` | Last active ${friend.lastActive}`}
                  </p>
                </div>
              </div>

              <div className="flex gap-1 items-center">
                <button
                  onClick={() => handleMessage(friend.id, friend.name)}
                  className="btn btn-ghost btn-sm text-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-colors rounded-lg"
                  title="Message"
                >
                  <MessageCircle size={20} />
                </button>
                <button
                  onClick={() => handleUnfriend(friend.id, friend.name)}
                  className="btn btn-ghost btn-sm text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors rounded-lg"
                  title="Unfriend"
                >
                  <UserRoundMinus size={20} />
                </button>
              </div>
            </div>
          ))}

          {friends.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="btn btn-outline border-blue-400 text-blue-600 hover:bg-blue-500 hover:text-white transition-all duration-300 w-full mt-4 rounded-lg"
            >
              <Eye size={18} />
              {showAll ? "Show Less" : `View All ${friends.length} Friends`}
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default Friends;
