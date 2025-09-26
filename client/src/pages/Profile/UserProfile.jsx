import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";

export default function UserProfile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/users.json")
      .then((res) => res.json())
      .then((data) => {
        const foundUser = data.users.find((u) => u.username === username);
        setUser(foundUser);
      });
  }, [username]);

  if (!user) return <p className="text-center py-20">Loading...</p>;

  return (
    <section className="py-12 px-6 bg-gradient-to-br from-purple-600 to-pink-500 min-h-screen text-white">
      <div className="max-w-3xl mx-auto bg-white text-gray-800 rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center">
          <img
            src={user.profilePic}
            alt={user.name}
            className="w-28 h-28 rounded-full mb-4 border-4 border-pink-500"
          />
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-sm text-gray-500">@{user.username}</p>
          <p className="mt-2 text-center">{user.bio}</p>
          <p className="text-sm mt-2 text-gray-600">📍 {user.location}</p>

          <div className="flex gap-4 mt-4">
            <button className="px-5 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition">
              Follow
            </button>
            <button className="px-5 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition">
              Message
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest, i) => (
              <span
                key={i}
                className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-6 text-center">
          <div className="bg-purple-50 p-4 rounded-xl shadow">
            <h4 className="font-bold text-lg">{user.followers.length}</h4>
            <p className="text-gray-500">Followers</p>
          </div>
          <div className="bg-pink-50 p-4 rounded-xl shadow">
            <h4 className="font-bold text-lg">{user.following.length}</h4>
            <p className="text-gray-500">Following</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/follow"
            className="px-6 py-2 bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300 transition"
          >
            ← Back to Follow Page
          </Link>
        </div>
      </div>
    </section>
  );
}
