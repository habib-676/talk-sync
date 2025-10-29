import { useEffect, useRef, useState } from "react";
import { IoIosSend, IoMdPhotos } from "react-icons/io";
import { RiInformationLine } from "react-icons/ri";
import { MdVideoCall, MdArrowBackIosNew } from "react-icons/md";

import logo from "../../../assets/logo/logo.png";
import { formatMessageTime, markConversationSeen } from "../../../lib/utils";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import { useCall } from "../../../providers/CallProvider";

// Video calling is now handled globally by CallProvider.

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const scrollEnd = useRef();
  const { user, socketRef, onlineUsers } = useAuth();

  const [messages, setMessages] = useState([]); // conversation messages
  const [text, setText] = useState(""); // message input text
  const [sending, setSending] = useState(false);

  // Call actions from provider
  const { initiateCall } = useCall();

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // fetch messages when selectedUser changes
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

    // mark this conversation as seen for the current user
    (async () => {
      try {
        await markConversationSeen(user.uid, selectedUser.uid);
      } catch {
        // no-op: best-effort
      }
    })();
  }, [selectedUser, user]);

  // socket listener for real-time incoming messages
  useEffect(() => {
    const socket = socketRef?.current;
    if (!socket) return;

    const messageHandler = (newMessage) => {
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

    socket.on("newMessage", messageHandler);

    return () => {
      socket.off("newMessage", messageHandler);
    };
  }, [socketRef, selectedUser, user]);

  // All call logic moved to CallProvider

  // --- send message handler ---
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
    // POST to backend - backend will save + emit to the receiver socket
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMsg),
      });
      if (!res.ok) {
        throw new Error("Failed to send message");
      }
      await res.json();
      // Optionally update optimistic message with server data
    } catch (err) {
      console.error("Send message error:", err);
      // rollback or mark as failed — left as improvement
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // For UX: small helper to check if selected user is online
  const isSelectedUserOnline =
    selectedUser && onlineUsers?.includes(selectedUser.uid);

  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 border-l border-primary max-md:hidden">
        <img src={logo} className="max-w-16" alt="" />
        <p className="text-lg font-medium">Lets start your journey</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto relative border-l border-r border-base-300 bg-base-200/30">
      {/* header */}
      <div className="flex items-center gap-3 py-3 px-4 border-b border-base-300 sticky top-0 bg-base-100/80 backdrop-blur z-10">
        {/* Mobile back button to open sidebar */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-base-200 text-secondary"
          onClick={() => setSelectedUser(null)}
          title="Back"
        >
          <MdArrowBackIosNew size={18} />
        </button>
        <img
          src={selectedUser.image || selectedUser.profilePic || null}
          alt=""
          className="w-8 h-8 object-cover rounded-full"
        />
        <div className="flex-1 flex items-center gap-2">
          <p className="text-base font-medium">
            {selectedUser.name || selectedUser.fullName || "Unknown"}
          </p>
          {isSelectedUserOnline && (
            <span className="w-2 h-2 rounded-full bg-green-500" />
          )}
        </div>

        {/* VIDEO CALL BUTTON */}
        <button
          type="button"
          title={isSelectedUserOnline ? "Start video call" : "User offline"}
          onClick={() => {
            if (!isSelectedUserOnline) {
              toast.error("User is offline or not connected.");
              return;
            }
            initiateCall(selectedUser);
          }}
          className={`p-2 rounded-lg ${
            isSelectedUserOnline
              ? "text-primary hover:bg-primary/10"
              : "opacity-40 cursor-not-allowed"
          }`}
        >
          <MdVideoCall size={20} />
        </button>

        <div className="hidden md:block text-secondary/70">
          <RiInformationLine size={18} />
        </div>
      </div>

      {/* chat messages */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-auto p-4 pb-16">
        {messages.map((msg, index) => {
          const isMe = msg.senderId === user.uid;
          return (
            <div
              key={index}
              className={`flex items-end gap-2 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              {msg.image ? (
                <img
                  src={msg.image}
                  alt=""
                  className={`max-w-[230px] border ${
                    isMe ? "border-primary/70" : "border-base-300"
                  } rounded-xl overflow-hidden mb-6`}
                />
              ) : (
                <p
                  className={`px-3 py-2 max-w-[240px] text-sm rounded-2xl mb-3 break-words shadow-sm ${
                    isMe
                      ? "bg-primary/80 text-white rounded-br-sm"
                      : "bg-base-100 text-secondary rounded-bl-sm border border-base-200"
                  }`}
                >
                  {msg.text}
                </p>
              )}

              <div className="text-center text-xs">
                <img
                  src={
                    isMe
                      ? user.photoURL || null
                      : selectedUser.image || selectedUser.profilePic || null
                  }
                  className="w-7 h-7 object-cover rounded-full"
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
        <div className="flex-1 flex items-center bg-base-100/80 backdrop-blur px-3 rounded-full border border-base-300">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message"
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none placeholder-gray-400 resize-none bg-transparent"
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
