import { useEffect, useState } from "react";
import {
  FaStar,
  FaUsers,
  FaEnvelope,
  FaCalendarAlt,
  FaHeart,
  FaWhatsapp,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import { useParams } from "react-router";

const TutorDetails = () => {
  const { id } = useParams();
  const [tutor, setTutor] = useState(null);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/tutors/${id}`)
      .then((res) => res.json())
      .then((data) => setTutor(data))
      .catch((err) => console.error("Failed to load tutor:", err));
  }, [id]);

  if (!tutor) {
    return (
      <p className="text-center text-lg mt-20 font-semibold text-gray-500">
        Loading tutor details...
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 grid md:grid-cols-[2.2fr_0.8fr] gap-8">
      {/* LEFT SIDE — Tutor Info */}
      <div className="bg-white rounded-2xl shadow-xl p-6 space-y-5">
        <div className="flex items-center gap-4">
          <img
            src={tutor.image}
            alt={tutor.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-pink-200"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{tutor.name}</h2>
              <img src={tutor.flag} alt="flag" className="w-6 h-4 rounded-sm" />
            </div>
            <p className="text-gray-500">
              {tutor.type} |{" "}
              <span className="font-medium text-pink-500">{tutor.badge}</span>
            </p>
            <p className="text-sm text-gray-400">
              Experience: {tutor.experience}+ Years
            </p>
          </div>
        </div>

        {/* About Me */}
        <p className="text-gray-700">
          <span className="font-bold text-xl">About Me</span>
          <br />
          {tutor.description}
        </p>
        <p className="text-gray-700 italic">"{tutor.shortBio}"</p>

        {/* Stats */}
        <h2 className="text-xl font-bold">Student Feedback</h2>
        <div className="flex flex-wrap gap-6 text-sm mt-4">
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400" /> {tutor.rating} (
            {tutor.reviews} reviews)
          </div>
          <div className="flex items-center gap-1">
            <FaUsers className="text-pink-400" /> {tutor.lessons} lessons
          </div>
          <div className="flex items-center gap-1">
            <FaCalendarAlt className="text-blue-400" /> {tutor.students} students
          </div>
        </div>

        {/* Speaks */}
        {tutor.speaks && (
          <div>
            <h3 className="font-semibold mt-4 mb-2 text-xl">Speaks:</h3>
            <ul className="flex flex-wrap gap-2">
              {tutor.speaks.map((lang, i) => (
                <li
                  key={i}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  {lang.language} ({lang.level})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Specialist In */}
        {tutor.specialist && (
          <div>
            <h3 className="font-semibold mt-4 mb-2 text-xl">Specialist In:</h3>
            <ul className="flex flex-wrap gap-2">
              {tutor.specialist.map((item, i) => (
                <li
                  key={i}
                  className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* RIGHT SIDE — Video + Buttons */}
      <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center space-y-5">
        {/* YouTube Video */}
        <div className="w-full aspect-video rounded-xl overflow-hidden shadow mt-5">
          <iframe
            src={
              tutor.video.includes("youtu.be")
                ? tutor.video
                    .replace("youtu.be/", "www.youtube.com/embed/")
                    .split("?")[0]
                : tutor.video.replace("watch?v=", "embed/")
            }
            title={tutor.name}
            className="w-full h-full"
            allowFullScreen
          ></iframe>
        </div>

        {/* Buttons */}
        <button
          onClick={() => setShowTrialModal(true)}
          className="btn bg-pink-500 hover:bg-pink-600 text-white w-full flex items-center gap-2 justify-center"
        >
          <FaCalendarAlt /> Book Trial Lesson
        </button>

        <button
          onClick={() => setShowShareModal(true)}
          className="btn btn-outline w-full flex items-center gap-2 justify-center"
        >
          <FaEnvelope /> Share Tutor
        </button>

        <button className="btn btn-outline w-full flex items-center gap-2 justify-center text-pink-600 border-pink-400 hover:bg-pink-50">
          <FaHeart /> Save to My List
        </button>
      </div>

      {/* BOOK TRIAL MODAL */}
      {showTrialModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[90%] md:w-[420px] p-6 shadow-2xl relative">
            <button
              onClick={() => setShowTrialModal(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-lg"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-3 text-center text-gray-800">
              Book a Trial Lesson
            </h2>
            <p className="text-sm text-gray-500 text-center mb-5">
              To discuss your level and learning plan
            </p>

            {/* Duration */}
            <div className="flex justify-center gap-4 mb-5">
              <button className="px-4 py-2 rounded-lg bg-pink-500 text-white text-sm font-medium">
                25 mins
              </button>
              <button className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100">
                50 mins
              </button>
            </div>

            {/* Available Times */}
            <h3 className="font-semibold text-gray-800 mb-2">Available Slots:</h3>
            <div className="grid grid-cols-3 gap-3 text-sm text-center">
              {[
                "11:30 AM",
                "12:00 PM",
                "1:30 PM",
                "2:30 PM",
                "3:00 PM",
                "7:00 PM",
                "8:00 PM",
                "9:00 PM",
              ].map((time) => (
                <button
                  key={time}
                  className="border border-gray-300 hover:bg-pink-100 rounded-lg py-2"
                >
                  {time}
                </button>
              ))}
            </div>

            <button className="w-full mt-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium">
              Continue
            </button>
          </div>
        </div>
      )}

      {/* SHARE TUTOR MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[90%] md:w-[450px] p-6 shadow-2xl relative">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-lg"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-5 text-gray-800 text-center">
              Share this tutor
            </h2>

            {/* Tutor Info */}
            <div className="flex items-center justify-between mb-5 border border-gray-200 rounded-xl p-3 shadow-sm">
              <div className="flex items-center gap-3">
                <img
                  src={tutor.image}
                  alt={tutor.name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-300"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <img
                      src={tutor.flag}
                      alt="flag"
                      className="w-5 h-4 rounded-sm border border-gray-300"
                    />
                    <p className="font-semibold text-gray-800">{tutor.name}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-yellow-500">
                    <FaStar />{" "}
                    <span className="text-gray-600">{tutor.rating}</span>
                    <span className="text-gray-400">
                      ({tutor.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-green-600 text-xs font-medium border border-green-400 px-2 py-0.5 rounded-full">
                Verified
              </span>
            </div>

            {/* Copy Link */}
            <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg mb-5">
              <input
                type="text"
                readOnly
                value={`https://preply.in/${tutor.name
                  .replace(/\s+/g, "")
                  .toUpperCase()}${tutor.id}`}
                className="w-full bg-transparent text-sm text-gray-700 outline-none px-2"
              />
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `https://preply.in/${tutor.name
                      .replace(/\s+/g, "")
                      .toUpperCase()}${tutor.id}`
                  )
                }
                className="bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium px-4 py-1.5 rounded-md transition-all"
              >
                Copy link
              </button>
            </div>

            {/* Share Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium py-2 rounded-lg transition-all">
                <FaEnvelope /> Email
              </button>
              <button className="flex items-center justify-center gap-2 border border-green-500 text-green-600 hover:bg-green-50 font-medium py-2 rounded-lg transition-all">
                <FaWhatsapp /> WhatsApp
              </button>
              <button className="flex items-center justify-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 rounded-lg transition-all">
                <FaLinkedin /> LinkedIn
              </button>
              <button className="flex items-center justify-center gap-2 border border-gray-400 text-gray-700 hover:bg-gray-100 font-medium py-2 rounded-lg transition-all">
                <FaTwitter /> X (Twitter)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default TutorDetails;