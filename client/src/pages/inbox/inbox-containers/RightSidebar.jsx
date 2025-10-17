import React from "react";
import { RxAvatar } from "react-icons/rx";
import useAuth from "../../../hooks/useAuth";

const RightSidebar = ({ selectedUser }) => {
  const { onlineUsers } = useAuth();
  const isOnline = selectedUser && onlineUsers?.includes(selectedUser.uid);
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
        </div>
      </div>
    )
  );
};

export default RightSidebar;
