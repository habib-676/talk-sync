import { useState } from "react";
import Sidebar from "./inbox-containers/Sidebar";
import ChatContainer from "./inbox-containers/ChatContainer";
import RightSidebar from "./inbox-containers/RightSidebar";

const Inbox = () => {
  const [selectedUser, setSelectedUser] = useState(false);
  return (
    <div className="my-2 w-full h-[calc(90vh-32px)] sm:px-[3%] lg:px-[8%]">
      <div
        className={`bg-base-100/40 backdrop-blur-xl border border-primary/30 rounded-2xl overflow-hidden h-full grid grid-cols-1 relative ${
          selectedUser
            ? "md:grid-cols-[1fr_1.6fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
            : "md:grid-cols-[1fr_1.6fr] xl:grid-cols-[1fr_2fr]"
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
