import React from "react";
import { RxAvatar } from "react-icons/rx";

const RightSidebar = ({ selectedUser }) => {
  return (
    selectedUser && (
      <div
        className={`w-full relative overflow-y-scroll ${
          selectedUser ? "max-md:hidden" : ""
        }`}
      >
        <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
          {selectedUser?.profilePic || selectedUser?.image ? (
            <img
              src={selectedUser.profilePic || selectedUser.image}
              alt=""
              className="w-20 aspect-[1/1] object-cover rounded-full"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-base-200 flex items-center justify-center">
              <RxAvatar size={36} />
            </div>
          )}

          <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
            <p className="w-2 h-2 rounded-full bg-green-500"></p>
            {selectedUser.fullName || selectedUser.name}
          </h1>
          <p className="px-10 mx-auto">{selectedUser.bio}</p>
        </div>
      </div>
    )
  );
};

export default RightSidebar;
