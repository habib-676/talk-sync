import { useState } from "react";
import Sidebar from "./inbox-containers/Sidebar";
import ChatContainer from "./inbox-containers/ChatContainer";
import RightSidebar from "./inbox-containers/RightSidebar";

const Inbox = () => {
  const [selectedUser, setSelectedUser] = useState(false);
  return (
    <div className=" my-20 w-full h-screen sm:px-[15%] sm:py-[5%]">
      <div
        className={`backdrop-blur-x1 border-2 border-primary rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative ${
          selectedUser
            ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr ]"
            : "md:grid-cols-2"
        }`}
      >
        <Sidebar
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
        <ChatContainer
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
        <RightSidebar
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </div>
    </div>
  );
};

export default Inbox;
