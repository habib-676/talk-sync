import { useEffect, useRef, useState } from "react";
import { RxAvatar } from "react-icons/rx";
import { IoIosSend, IoMdPhotos } from "react-icons/io";
import { RiInformationLine } from "react-icons/ri";
import { MdVideoCall, MdCallEnd } from "react-icons/md";

import logo from "../../../assets/logo/logo.png";
import { formatMessageTime } from "../../../lib/utils";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";

const STUN_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }];

const CallModal = ({
  visible,
  status,
  callerName,
  calleeName,
  isCaller,
  onAccept,
  onDecline,
  onEnd,
  onCancel,
  localVideoRef,
  remoteVideoRef,
}) => {
  if (!visible) return null;

  // Button sets vary by status:
  // - 'ringing' => incoming: accept / decline
  // - 'calling' => caller waiting: cancel
  // - 'in-call' => show end call
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl p-4 shadow-xl">
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-sm text-gray-500">
              {status === "ringing" && `Incoming call from ${callerName}`}
              {status === "calling" && `Calling ${calleeName}...`}
              {status === "in-call" &&
                `In call with ${isCaller ? calleeName : callerName}`}
            </p>
          </div>
          <div>
            {status === "in-call" ? (
              <button
                onClick={onEnd}
                className="px-3 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2"
                title="End call"
              >
                <MdCallEnd />
                End
              </button>
            ) : status === "calling" ? (
              <button
                onClick={onCancel}
                className="px-3 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2"
                title="Cancel call"
              >
                <MdCallEnd />
                Cancel
              </button>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-black rounded overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-48 object-cover"
            />
            <p className="text-xs text-center py-1">You</p>
          </div>
          <div className="bg-black rounded overflow-hidden">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-48 object-cover"
            />
            <p className="text-xs text-center py-1">Remote</p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          {status === "ringing" && (
            <>
              <button
                onClick={onAccept}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Accept
              </button>
              <button
                onClick={onDecline}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Decline
              </button>
            </>
          )}

          {status === "calling" && (
            <p className="text-sm text-gray-500">
              Ringing... waiting for answer
            </p>
          )}

          {status === "in-call" && (
            <p className="text-sm text-gray-500">Call in progress</p>
          )}
        </div>
      </div>
    </div>
  );
};

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const scrollEnd = useRef();
  const { user, socketRef, onlineUsers } = useAuth();

  const [messages, setMessages] = useState([]); // conversation messages
  const [text, setText] = useState(""); // message input text
  const [sending, setSending] = useState(false);

  // --- Call related refs & state ---
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const otherUserIdRef = useRef(null);
  const isCallerRef = useRef(false);
  const callStatusRef = useRef("idle"); // mirror of state to read inside socket handlers

  const [callVisible, setCallVisible] = useState(false);
  const [callStatus, setCallStatus] = useState("idle"); // 'idle'|'calling'|'ringing'|'in-call'
  const [incomingCaller, setIncomingCaller] = useState(null); // { from, name, signal }

  // helper to set state + ref
  const setCallStatusSafe = (s) => {
    callStatusRef.current = s;
    setCallStatus(s);
  };

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

  // ------------------ SOCKET CALL HANDLERS ------------------
  useEffect(() => {
    const socket = socketRef?.current;
    if (!socket) return;

    // incoming call from another user
    const incomingCallHandler = (data) => {
      // data: { from, name, signal }
      console.log("incomingCall", data);

      // If busy, decline automatically
      if (callStatusRef.current !== "idle") {
        socket.emit("declineCall", { to: data.from });
        return;
      }

      setIncomingCaller({
        from: data.from,
        name: data.name,
        signal: data.signal,
      });
      otherUserIdRef.current = data.from;
      isCallerRef.current = false;
      setCallStatusSafe("ringing");
      setCallVisible(true);
    };

    // the callee accepted and sent an answer (for caller)
    const callAcceptedHandler = async (signal) => {
      console.log("callAccepted", signal);
      try {
        if (pcRef.current) {
          await pcRef.current.setRemoteDescription(
            new RTCSessionDescription(signal)
          );
          setCallStatusSafe("in-call");
          setCallVisible(true);
        }
      } catch (err) {
        console.error("Error setting remote description (answer):", err);
        cleanUpCall();
      }
    };

    const callDeclinedHandler = () => {
      console.log("callDeclined");
      // notify user and cleanup
      toast.error("Call was declined");
      cleanUpCall();
    };

    const iceCandidateHandler = async (candidate) => {
      if (!candidate || !pcRef.current) return;
      try {
        await pcRef.current.addIceCandidate(candidate);
      } catch (err) {
        console.error("Error adding received ICE candidate:", err);
      }
    };

    const endCallHandler = () => {
      console.log("endCall");
      toast.error("Call ended");
      cleanUpCall();
    };

    socket.on("incomingCall", incomingCallHandler);
    socket.on("callAccepted", callAcceptedHandler);
    socket.on("callDeclined", callDeclinedHandler);
    socket.on("iceCandidate", iceCandidateHandler);
    socket.on("endCall", endCallHandler);

    return () => {
      socket.off("incomingCall", incomingCallHandler);
      socket.off("callAccepted", callAcceptedHandler);
      socket.off("callDeclined", callDeclinedHandler);
      socket.off("iceCandidate", iceCandidateHandler);
      socket.off("endCall", endCallHandler);
    };
  }, [socketRef]);

  // cleanup when component unmounts
  useEffect(() => {
    return () => {
      cleanUpCall();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------ CALL ACTIONS ------------------
  const initiateCall = async () => {
    if (!selectedUser) {
      toast.error("Select a user to call");
      return;
    }
    if (!onlineUsers.includes(selectedUser.uid)) {
      toast.error("User is offline");
      return;
    }

    isCallerRef.current = true;
    otherUserIdRef.current = selectedUser.uid;
    setCallStatusSafe("calling");
    setCallVisible(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const pc = new RTCPeerConnection({ iceServers: STUN_SERVERS });
      pcRef.current = pc;

      // attach local tracks
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // remote track handler
      pc.ontrack = (event) => {
        const [remoteStream] = event.streams;
        if (remoteVideoRef.current)
          remoteVideoRef.current.srcObject = remoteStream;
      };

      // ICE candidates -> send to callee
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.emit("iceCandidate", {
            to: otherUserIdRef.current,
            candidate: event.candidate,
          });
        }
      };

      // create offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // send offer to server to route to callee
      socketRef.current.emit("callUser", {
        userToCall: otherUserIdRef.current,
        signalData: offer,
        from: user.uid,
        name: user.displayName || user.email || user.uid,
      });
    } catch (err) {
      console.error("initiateCall error", err);
      toast.error("Unable to start call. Check camera/mic permissions.");
      cleanUpCall();
    }
  };

  const acceptIncomingCall = async () => {
    try {
      const caller = incomingCaller;
      if (!caller) return;

      setCallStatusSafe("in-call");
      setCallVisible(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const pc = new RTCPeerConnection({ iceServers: STUN_SERVERS });
      pcRef.current = pc;

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        const [remoteStream] = event.streams;
        if (remoteVideoRef.current)
          remoteVideoRef.current.srcObject = remoteStream;
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.emit("iceCandidate", {
            to: caller.from,
            candidate: event.candidate,
          });
        }
      };

      // set caller's offer as remote description
      await pc.setRemoteDescription(new RTCSessionDescription(caller.signal));

      // create answer and set local description
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // send answer to caller
      socketRef.current.emit("acceptCall", { to: caller.from, signal: answer });
    } catch (err) {
      console.error("acceptIncomingCall error", err);
      toast.error("Unable to accept call. Check camera/mic permissions.");
      cleanUpCall();
    }
  };

  const declineIncomingCall = () => {
    if (incomingCaller?.from) {
      socketRef.current.emit("declineCall", { to: incomingCaller.from });
    }
    cleanUpCall();
  };

  const cancelOutgoingCall = () => {
    // caller cancels before connected
    if (otherUserIdRef.current) {
      socketRef.current.emit("declineCall", { to: otherUserIdRef.current });
    }
    cleanUpCall();
  };

  const endCall = () => {
    const otherId = isCallerRef.current
      ? otherUserIdRef.current
      : incomingCaller?.from;
    if (otherId) socketRef.current.emit("endCall", { to: otherId });
    cleanUpCall();
  };

  // Clean up function (close pc, stop tracks, reset refs & state)
  const cleanUpCall = () => {
    setCallStatusSafe("idle");
    setCallVisible(false);
    setIncomingCaller(null);

    isCallerRef.current = false;
    otherUserIdRef.current = null;

    // close peer connection
    try {
      if (pcRef.current) {
        pcRef.current.ontrack = null;
        pcRef.current.onicecandidate = null;
        pcRef.current.close();
        pcRef.current = null;
      }
    } catch (err) {
      console.warn("pc cleanup error", err);
    }

    // stop local tracks
    try {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
    } catch (err) {
      console.warn("stream cleanup error", err);
    }

    // clear video elements
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  };

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
      const saved = await res.json();
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

        {/* VIDEO CALL BUTTON */}
        <div
          title={isSelectedUserOnline ? "Start video call" : "User offline"}
          onClick={() => {
            if (!isSelectedUserOnline) {
              toast.error("User is offline or not connected.");
              return;
            }
            initiateCall();
          }}
          className={`cursor-pointer mr-2 ${
            isSelectedUserOnline
              ? "text-primary"
              : "opacity-40 cursor-not-allowed"
          }`}
        >
          <MdVideoCall size={22} />
        </div>

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

      {/* Call modal */}
      <CallModal
        visible={callVisible}
        status={callStatus}
        callerName={incomingCaller?.name}
        calleeName={selectedUser?.name || selectedUser?.fullName}
        isCaller={isCallerRef.current}
        onAccept={acceptIncomingCall}
        onDecline={declineIncomingCall}
        onEnd={endCall}
        onCancel={cancelOutgoingCall}
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
      />
    </div>
  );
};

export default ChatContainer;
