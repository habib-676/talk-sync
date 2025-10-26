import React, { useEffect, useState } from "react";
import { RxAvatar } from "react-icons/rx";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";

const RightSidebar = ({ selectedUser }) => {
  const { onlineUsers, user } = useAuth();
  const isOnline = selectedUser && onlineUsers?.includes(selectedUser.uid);
  const [feedbacks, setFeedbacks] = useState([]);

  // simple relative time helper
  const timeAgo = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const s = Math.floor((Date.now() - d.getTime()) / 1000);
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const days = Math.floor(h / 24);
    return `${days}d ago`;
  };

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        if (!user?.uid || !selectedUser?.uid) {
          setFeedbacks([]);
          return;
        }
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/feedbacks`,
          { params: { to: user.uid, from: selectedUser.uid } }
        );
        if (data?.success) {
          setFeedbacks(Array.isArray(data.data) ? data.data : []);
        } else {
          setFeedbacks([]);
        }
      } catch (err) {
        console.error("Fetch feedbacks error:", err);
        setFeedbacks([]);
      }
    };
    fetchFeedbacks();
  }, [user?.uid, selectedUser?.uid]);
  return (
    selectedUser && (
      <div
        className={`w-full relative overflow-y-auto bg-base-100/40 backdrop-blur ${
          selectedUser ? "max-md:hidden" : ""
        }`}
      >
        {/* Profile card */}
        <div className="pt-10 pb-4 flex flex-col items-center gap-3 text-sm mx-auto">
          {selectedUser?.profilePic || selectedUser?.image ? (
            <img
              src={selectedUser.profilePic || selectedUser.image}
              alt=""
              className="w-24 h-24 object-cover rounded-full border border-base-300"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-base-200 flex items-center justify-center">
              <RxAvatar size={40} />
            </div>
          )}

          <h1 className="px-6 text-lg font-semibold mx-auto flex items-center gap-2">
            {isOnline && (
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
            )}
            {selectedUser.fullName || selectedUser.name}
          </h1>
          <p className="px-6 mx-auto text-gray-400 text-xs text-center">
            {selectedUser.bio || "No bio provided."}
          </p>
        </div>

        <div className="px-4">
          {/* Shared media */}
          <div className="bg-base-100/70 border border-base-300 rounded-xl p-4 mb-4">
            <p className="text-sm font-medium mb-3">Shared Media</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="aspect-video rounded-lg bg-base-200" />
              <div className="aspect-video rounded-lg bg-base-200" />
            </div>
          </div>

          {/* Feedback from this user */}
          <div className="bg-base-100/70 border border-base-300 rounded-xl p-4 mb-4">
            <p className="text-sm font-medium mb-3">Feedback from this user</p>
            {feedbacks.length === 0 ? (
              <p className="text-xs text-secondary/60">No feedback yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {feedbacks.map((fb, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-base-200 bg-base-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-secondary/70">
                        {timeAgo(fb.createdAt)}
                      </span>
                      <span className="text-xs">Rating: {fb.rating}/5</span>
                    </div>
                    {fb.words?.length ? (
                      <div className="mb-2 flex flex-wrap gap-1">
                        {fb.words.map((w, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                          >
                            {w}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {fb.sentences?.length ? (
                      <ul className="list-disc list-inside text-xs text-secondary">
                        {fb.sentences.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    ) : null}
                    {fb.notes ? (
                      <p className="mt-2 text-xs italic text-secondary/80">
                        {fb.notes}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default RightSidebar;
