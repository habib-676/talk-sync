import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { UserPlus, UserCheck } from "lucide-react";

export default function FollowPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/users.json")
      .then((res) => res.json())
      .then((data) => {
        // Load follow state and followers count from localStorage
        const savedFollowState = JSON.parse(localStorage.getItem('followState') || '{}');
        const savedFollowersCount = JSON.parse(localStorage.getItem('followersCount') || '{}');
        
        const withFollowState = data.users.map((u) => ({
          ...u,
          isFollowing: savedFollowState[u.username] || false,
          followersCount: savedFollowersCount[u.username] || u.followersCount
        }));
        setUsers(withFollowState);
      });
  }, []);

  const handleFollowToggle = (username) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.username === username) {
          const newFollowState = !user.isFollowing;
          const newFollowersCount = newFollowState 
            ? user.followersCount + 1
            : user.followersCount - 1;

          // Update localStorage for follow state
          const savedFollowState = JSON.parse(localStorage.getItem('followState') || '{}');
          savedFollowState[username] = newFollowState;
          localStorage.setItem('followState', JSON.stringify(savedFollowState));

          // Update localStorage for followers count
          const savedFollowersCount = JSON.parse(localStorage.getItem('followersCount') || '{}');
          savedFollowersCount[username] = newFollowersCount;
          localStorage.setItem('followersCount', JSON.stringify(savedFollowersCount));

          return {
            ...user,
            isFollowing: newFollowState,
            followersCount: newFollowersCount
          };
        }
        return user;
      })
    );
  };

  return (
    <section className="py-12 px-6 bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500 min-h-screen text-white">
      <h2 className="text-4xl font-extrabold text-center mb-12 drop-shadow-lg">
        Find People to Follow
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {users.map((user, index) => (
          <div
            key={index}
            className="bg-white text-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl hover:scale-105 transition duration-300"
          >
            <img
              src={user.profilePic}
              alt={user.name}
              className="w-24 h-24 rounded-full mb-4 border-4 border-purple-500 shadow-md"
            />
            <h3 className="text-lg font-bold">{user.name}</h3>
            <p className="text-sm text-gray-500">@{user.username}</p>
            <p className="mt-3 text-center text-sm line-clamp-2">{user.bio}</p>

            <div className="flex justify-between gap-6 mt-4 text-sm font-medium">
              <span className="text-purple-600">
                {user.followersCount} Followers
              </span>
              <span className="text-pink-600">
                {user.followingCount} Following
              </span>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => handleFollowToggle(user.username)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition shadow 
                  ${
                    user.isFollowing
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
              >
                {user.isFollowing ? (
                  <>
                    <UserCheck size={16} /> Following
                  </>
                ) : (
                  <>
                    <UserPlus size={16} /> Follow
                  </>
                )}
              </button>
              <Link
                to={`/profile/${user.username}`}
                className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition shadow"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}