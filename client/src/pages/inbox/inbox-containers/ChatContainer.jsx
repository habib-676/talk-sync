import { useEffect, useRef } from "react";
import { RxAvatar } from "react-icons/rx";
import { IoIosSend, IoMdPhotos } from "react-icons/io";
import { RiInformationLine } from "react-icons/ri";

import logo from "../../../assets/logo/logo.png";
import { formatMessageTime } from "../../../lib/utils";
import useAuth from "../../../hooks/useAuth";
import { useState } from "react";

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const scrollEnd = useRef();
  const { user, socketRef } = useAuth();
  const [messages, setMessages] = useState([]); // conversation messages
  const [text, setText] = useState(""); // message input text
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (!selectedUser || !user) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/messages?senderId=${
            user.uid
          }&receiverId=${selectedUser.uid}`
        );
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        setMessages(data || []);
      } catch (err) {
        console.error("Fetch messages error:", err);
      }
    };

    fetchMessages();
  }, [selectedUser, user]);

  // socket listener for real-time incoming messages
  useEffect(() => {
    const socket = socketRef?.current;
    if (!socket) return;

    const handler = (newMessage) => {
      // only append if message is part of the currently open conversation
      // newMessage contains senderId/receiverId etc (server sends it)
      const otherId = selectedUser?.uid;
      if (!otherId) return;

      const isRelevant =
        (newMessage.senderId === otherId &&
          newMessage.receiverId === user.uid) ||
        (newMessage.senderId === user.uid && newMessage.receiverId === otherId);

      if (isRelevant) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on("newMessage", handler);

    return () => {
      socket.off("newMessage", handler);
    };
  }, [socketRef, selectedUser, user]);

  // send message handler
  const sendMessage = async () => {
    if (!text.trim() || !user || !selectedUser) return;
    setSending(true);

    const newMsg = {
      senderId: user.uid,
      receiverId: selectedUser.uid,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    // optimistic UI update
    setMessages((prev) => [...prev, newMsg]);
    setText("");
    // POST to backend - backend will save and emit to the receiver socket
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMsg),
      });
      if (!res.ok) {
        throw new Error("Failed to send message");
      }
      const saved = await res.json();
      // Optionally, replace optimistic message with saved (if saved contains _id or server timestamp)
      // For simplicity, we won't replace here; you can match by createdAt and update if you like
    } catch (err) {
      console.error("Send message error:", err);
      // rollback or mark as failed — left as improvement
    } finally {
      setSending(false);
    }
  };

  // input key handler (Enter -> send)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 border-l border-primary max-md:hidden">
        <img src={logo} className="max-w-16" alt="" />
        <p className="text-lg font-medium">Lets start your journey</p>
      </div>
    );
  }
  return (
    <div className="h-full overflow-scroll relative border-l border-r border-gray-300 bg-primary/5">
      {/* header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-accent">
        <img
          src={selectedUser.image || selectedUser.profilePic || ""}
          alt=""
          className="w-8 aspect-[1/1] object-cover rounded-full"
        />
        <p className="flex-1 text-lg  flex items-center gap-2">
          {selectedUser.name || selectedUser.fullName || "Unknown"}
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
        </p>
        <div
          onClick={() => setSelectedUser(null)}
          alt=""
          className="md:hidden max-w-7"
        >
          <RxAvatar />
        </div>
        <div className="max-md:hidden max-w-5 ">
          <RiInformationLine size={20} />
        </div>
      </div>

      {/* chat messages */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages.map((msg, index) => {
          const isMe = msg.senderId === user.uid;
          return (
            <div
              key={index}
              className={`flex items-end gap-2 justify-end ${
                !isMe && "flex-row-reverse"
              }`}
            >
              {msg.image ? (
                <img
                  src={msg.image}
                  alt=""
                  className="max-w-[230px]  border border-primary/70 rounded-lg overflow-hidden mb-8"
                />
              ) : (
                <p
                  className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-primary/70 text-white ${
                    isMe ? "rounded-br-none" : "rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </p>
              )}

              <div className="text-center text-xs">
                <img
                  src={
                    isMe
                      ? user.photoURL || ""
                      : selectedUser.image || selectedUser.profilePic || ""
                  }
                  className="w-7 aspect-[1/1] object-cover rounded-full"
                />
                <p className="text-gray-500">
                  {formatMessageTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={scrollEnd}></div>
      </div>

      {/* bottom input */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-primary/10 px-3 rounded-full">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message"
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none placeholder-gray-400 resize-none"
            rows={1}
          />
          <input type="file" id="image" accept="image/png, image/jpeg" hidden />
          <label htmlFor="image">
            <div className="w-5 mr-2 cursor-pointer text-primary">
              <IoMdPhotos />
            </div>
          </label>
        </div>

        <div className="w-7 cursor-pointer text-primary ">
          <IoIosSend
            onClick={sendMessage}
            className={`hover:scale-150 transition-all duration-200 hover:text-accent ${
              sending ? "opacity-50" : ""
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
