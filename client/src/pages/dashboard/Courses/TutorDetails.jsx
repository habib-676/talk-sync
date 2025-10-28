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
  FaClock,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { useParams } from "react-router";
import { toast } from "react-hot-toast";

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
    <div className="max-w-6xl mx-auto py-12 px-4 grid md:grid-cols-[2.1fr_0.9fr] gap-10">
      {/* LEFT SIDE — Tutor Info */}
      <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-3xl shadow-2xl p-8 space-y-6 border border-gray-100 hover:shadow-blue-200/50 transition-all duration-300">
        <div className="flex items-center gap-6">
          <img
            src={tutor.image}
            alt={tutor.name}
            className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-extrabold text-gray-900">
                {tutor.name}
              </h2>
              <img
                src={tutor.flag}
                alt="flag"
                className="w-6 h-4 rounded-sm shadow-sm"
              />
            </div>
            <p className="text-gray-500 text-sm mt-1">
              {tutor.type} |{" "}
              <span className="font-semibold text-blue-600">
                {tutor.badge}
              </span>
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Experience: {tutor.experience}+ Years
            </p>
          </div>
        </div>

        {/* About Me */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-inner border border-gray-100">
          <h3 className="font-bold text-xl mb-2 text-blue-700">About Me</h3>
          <p className="text-gray-700 leading-relaxed">{tutor.description}</p>
          <p className="text-gray-600 italic mt-3 border-l-4 border-blue-500 pl-3">
            "{tutor.shortBio}"
          </p>
        </div>

        {/* Feedback */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Student Feedback
          </h2>
          <div className="flex flex-wrap gap-5 text-sm mt-3">
            <div className="flex items-center gap-1 text-yellow-500 font-medium">
              <FaStar /> {tutor.rating} ({tutor.reviews} reviews)
            </div>
            <div className="flex items-center gap-1 text-pink-500 font-medium">
              <FaUsers /> {tutor.lessons} lessons
            </div>
            <div className="flex items-center gap-1 text-blue-500 font-medium">
              <FaCalendarAlt /> {tutor.students} students
            </div>
          </div>
        </div>

        {/* Speaks */}
        {tutor.speaks && (
          <div>
            <h3 className="font-semibold mt-6 mb-2 text-gray-800 text-lg">
              Speaks:
            </h3>
            <div className="flex flex-wrap gap-2">
              {tutor.speaks.map((lang, i) => (
                <span
                  key={i}
                  className="bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm"
                >
                  {lang.language} ({lang.level})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Specialist In */}
        {tutor.specialist && (
          <div>
            <h3 className="font-semibold mt-6 mb-2 text-gray-800 text-lg">
              Specialist In:
            </h3>
            <div className="flex flex-wrap gap-2">
              {tutor.specialist.map((item, i) => (
                <span
                  key={i}
                  className="bg-gradient-to-r from-pink-100 to-pink-50 text-pink-700 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT SIDE — Video + Buttons */}
      <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center space-y-6 border border-gray-100 hover:shadow-blue-200/50 transition-all duration-300">
        <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-200">
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

        {/* Unique About Video Section */}
        <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 text-center shadow-inner">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">
            About This Video 🎥
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            Experience how <span className="font-semibold">{tutor.name}</span>{" "}
            helps learners speak confidently with real-world examples, fun
            lessons, and personalized techniques that make learning enjoyable
            and practical.
          </p>
        </div>

        {/* Buttons */}
        <button
          onClick={() => setShowTrialModal(true)}
          className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:scale-[1.02] transition-all duration-300"
        >
          <FaCalendarAlt className="inline-block mr-2" /> Book Trial Lesson
        </button>

        <button
          onClick={() => setShowShareModal(true)}
          className="w-full py-3 bg-white text-gray-700 font-medium border border-gray-200 rounded-2xl hover:bg-gray-50 shadow-sm transition-all"
        >
          <FaEnvelope className="inline-block mr-2" /> Share Tutor
        </button>
      </div>

      {/* ===== MODALS ===== */}
      {/* TRIAL MODAL */}
      {showTrialModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-[90%] md:w-[420px] p-8 shadow-2xl relative border border-blue-100">
            <button
              onClick={() => setShowTrialModal(false)}
              className="absolute top-4 right-5 text-gray-500 hover:text-red-500 text-lg"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-3 text-center text-blue-800">
              Book a Trial Lesson
            </h2>
            <p className="text-sm text-gray-600 text-center mb-5">
              Select your preferred duration and time slot
            </p>

            {/* Duration Buttons */}
            <div className="flex justify-center gap-4 mb-5">
              <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium shadow">
                <FaClock className="inline-block mr-2" /> 25 mins
              </button>
              <button className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100">
                <FaClock className="inline-block mr-2" /> 50 mins
              </button>
            </div>

            {/* Available Slots */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2 text-center">
                  <FaSun className="inline-block mr-2 text-yellow-500" />
                  Afternoon
                </h3>
                <div className="grid grid-cols-3 gap-3 text-sm text-center">
                  {["12:00 PM", "1:30 PM", "2:30 PM"].map((time) => (
                    <button
                      key={time}
                      className="border border-gray-300 hover:bg-blue-50 text-gray-700 font-medium rounded-xl py-2 transition-all"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2 text-center">
                  <FaMoon className="inline-block mr-2 text-indigo-500" />
                  Evening
                </h3>
                <div className="grid grid-cols-3 gap-3 text-sm text-center">
                  {["7:00 PM", "8:00 PM", "9:00 PM"].map((time) => (
                    <button
                      key={time}
                      className="border border-gray-300 hover:bg-blue-50 text-gray-700 font-medium rounded-xl py-2 transition-all"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                toast.success("Trial lesson booked successfully!");
                setShowTrialModal(false);
              }}
              className="w-full mt-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow hover:shadow-lg transition-all"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* SHARE MODAL — unchanged */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-[90%] md:w-[450px] p-8 shadow-2xl relative border border-indigo-100">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-5 text-gray-500 hover:text-red-500 text-lg"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-5 text-gray-800 text-center">
              Share this Tutor
            </h2>

            <div className="flex items-center justify-between mb-5 border border-gray-200 rounded-2xl p-3 bg-white/70 shadow-sm">
              <div className="flex items-center gap-3">
                <img
                  src={tutor.image}
                  alt={tutor.name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-300 shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <img
                      src={tutor.flag}
                      alt="flag"
                      className="w-5 h-4 rounded-sm border border-gray-300"
                    />
                    <p className="font-semibold text-gray-800">
                      {tutor.name}
                    </p>
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

            <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-xl mb-5 border border-gray-200">
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
                className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-sm font-medium px-4 py-1.5 rounded-md hover:scale-105 transition-all"
              >
                Copy
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium py-2 rounded-xl transition-all">
                <FaEnvelope /> Email
              </button>
              <button className="flex items-center justify-center gap-2 border border-green-500 text-green-600 hover:bg-green-50 font-medium py-2 rounded-xl transition-all">
                <FaWhatsapp /> WhatsApp
              </button>
              <button className="flex items-center justify-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 rounded-xl transition-all">
                <FaLinkedin /> LinkedIn
              </button>
              <button className="flex items-center justify-center gap-2 border border-gray-400 text-gray-700 hover:bg-gray-100 font-medium py-2 rounded-xl transition-all">
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
