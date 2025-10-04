import {
  Eye,
  UserRoundMinus,
  MessageCircle,
  UserX,
  Circle,
} from "lucide-react";
import React, { useState, useEffect } from "react";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // Enhanced mock data with online status
  const mockFriends = [
    {
      id: 1,
      name: "Miguel Rodriguez",
      nativeLanguage: "Japanese",
      photo:
        "https://res.cloudinary.com/dnh9rdh01/image/upload/v1756112807/rlhh0w8p5tizu61g7fin.jpg",
      learningLanguages: ["English", "Spanish"],
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
      learningLanguages: ["French"],
      level: "Advanced",
      lastActive: "5 minutes ago",
      isOnline: true,
    },
  ];

  useEffect(() => {
    // Fetch friends data
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
    if (!window.confirm(`Remove ${friendName} from your friends?`)) return;

    try {
      // TODO: API call to remove friend
      setFriends((prev) => prev.filter((friend) => friend.id !== friendId));
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  const handleMessage = (friendId) => {
    // TODO: Navigate to chat
    console.log("Start chat with:", friendId);
  };

  const displayedFriends = showAll ? friends : friends.slice(0, 3);

  return (
    <section className="space-y-4 bg-base-300 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold">Friends ({friends.length})</h2>

      <div className="space-y-4">
        {displayedFriends.map((friend) => (
          <div
            key={friend.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-base-200 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="relative">
                <img
                  src={friend.photo}
                  alt={friend.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                />
                <div
                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                    friend.isOnline ? "bg-success" : "bg-gray-400"
                  }`}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-800">{friend.name}</h3>
                  {friend.isOnline && (
                    <span className="text-xs text-success font-medium">
                      Online
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  Native {friend.nativeLanguage}
                </p>
                {!friend.isOnline && (
                  <p className="text-xs text-gray-500">
                    Last seen {friend.lastActive}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => handleMessage(friend.id)}
                className="btn btn-ghost btn-sm text-info"
                title="Message"
              >
                <MessageCircle size={16} />
              </button>
              <button
                onClick={() => handleUnfriend(friend.id, friend.name)}
                className="btn btn-ghost btn-sm text-error"
                title="Unfriend"
              >
                <UserRoundMinus size={16} />
              </button>
            </div>
          </div>
        ))}

        {friends.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="btn btn-outline w-full"
          >
            <Eye size={16} />
            {showAll ? "Show Less" : `View All ${friends.length} Friends`}
          </button>
        )}
      </div>
    </section>
  );
};

export default Friends;

// Get user's friends
// GET /api/users/:userId/friends

// Remove friend
// DELETE /api/users/:userId/friends/:friendId

// Send message (navigate to chat)
//  GET /api/chat/:friendId
