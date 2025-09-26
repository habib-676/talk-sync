import React, { useEffect, useState } from "react";
import { Link } from "react-router";

export default function FollowPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/users.json")
      .then((res) => res.json())
      .then((data) => setUsers(data.users));
  }, []);

  return (
    <section className="py-12 px-6 bg-gradient-to-br from-purple-600 to-pink-500 min-h-screen text-white">
      <h2 className="text-3xl font-bold text-center mb-8">Find People to Follow</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.map((user, index) => (
          <div
            key={index}
            className="bg-white text-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition"
          >
            <img
              src={user.profilePic}
              alt={user.name}
              className="w-20 h-20 rounded-full mb-4 border-4 border-purple-500"
            />
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-sm text-gray-500">@{user.username}</p>
            <p className="mt-2 text-center text-sm">{user.bio}</p>

            <div className="flex gap-2 mt-4">
              <button className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition">
                Follow
              </button>
              <Link
                to={`/profile/${user.username}`}
                className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition"
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
