import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { UserPlus, MessageCircle, CheckCircle2, Star } from "lucide-react";

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
    <section className="py-12 px-6 bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500 min-h-screen text-white">
      <div className="max-w-4xl mx-auto bg-white text-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Cover Photo */}
        <div className="relative h-40 bg-gradient-to-r from-purple-400 to-pink-400">
          <img
            src={user.coverPhoto}
            alt="cover"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
            <img
              src={user.profilePic}
              alt={user.name}
              className="w-28 h-28 rounded-full border-4 border-white shadow-lg"
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-20 pb-8 px-8 text-center">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            {user.name}
            {user.isVerified && (
              <CheckCircle2 size={20} className="text-blue-500" />
            )}
          </h2>
          <p className="text-sm text-gray-500">@{user.username}</p>
          <p className="mt-3">{user.bio}</p>
          <p className="text-sm mt-2 text-gray-600">📍 {user.location}</p>
          <p className="text-sm text-gray-500">Joined: {user.joinDate}</p>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-5">
            <button className="flex items-center gap-2 px-5 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition shadow">
              <UserPlus size={16} /> Follow
            </button>
            <button className="flex items-center gap-2 px-5 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition shadow">
              <MessageCircle size={16} /> Message
            </button>
          </div>
        </div>

        {/* Interests */}
        {user.interests && (
          <div className="px-8 pb-6">
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
        )}

        {/* Achievements */}
        {user.achievements && (
          <div className="px-8 pb-6">
            <h3 className="text-lg font-semibold mb-3">Achievements</h3>
            <div className="flex flex-wrap gap-2">
              {user.achievements.map((a, i) => (
                <span
                  key={i}
                  className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  <Star size={14} /> {a}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Learning Goals */}
        {user.learningGoals && (
          <div className="px-8 pb-6">
            <h3 className="text-lg font-semibold mb-3">Learning Goals</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {user.learningGoals.map((goal, i) => (
                <li key={i}>{goal}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Social Links */}
        {user.socialLinks && (
          <div className="px-8 pb-6">
            <h3 className="text-lg font-semibold mb-3">Social Links</h3>
            <div className="flex flex-wrap gap-3">
              {Object.entries(user.socialLinks).map(([key, value]) => (
                <a
                  key={key}
                  href={`https://${value}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 px-8 pb-8 text-center">
          <div className="bg-purple-50 p-4 rounded-xl shadow">
            <h4 className="font-bold text-xl text-purple-700">
              {user.followersCount}
            </h4>
            <p className="text-gray-500">Followers</p>
          </div>
          <div className="bg-pink-50 p-4 rounded-xl shadow">
            <h4 className="font-bold text-xl text-pink-700">
              {user.followingCount}
            </h4>
            <p className="text-gray-500">Following</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl shadow">
            <h4 className="font-bold text-xl text-blue-700">
              {user.postsCount}
            </h4>
            <p className="text-gray-500">Posts</p>
          </div>
        </div>

        {/* Extra Details */}
        <div className="px-8 pb-10">
          <h3 className="text-lg font-semibold mb-3">Extra Info</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>🌍 Level: {user.languageLevel}</li>
            {user.availability && <li>⏰ Availability: {user.availability}</li>}
            {user.teachingStyle && <li>🎓 Teaching Style: {user.teachingStyle}</li>}
            {user.hourlyRate && <li>💲 Rate: ${user.hourlyRate}/hr</li>}
            {user.rating && <li>⭐ Rating: {user.rating}</li>}
            {user.targetExam && <li>📘 Exam: {user.targetExam} ({user.targetScore})</li>}
            {user.careerGoals && <li>💼 Career Goals: {user.careerGoals}</li>}
            {user.practiceTopics && (
              <li>💬 Practice Topics: {user.practiceTopics.join(", ")}</li>
            )}
          </ul>
        </div>

        {/* Back Button */}
        <div className="text-center pb-8">
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
