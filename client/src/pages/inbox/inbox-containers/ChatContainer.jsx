import { useEffect, useRef, useState } from "react";
import { Room, RoomEvent, Track, createLocalTracks } from "livekit-client";
import { RxAvatar } from "react-icons/rx";
import { IoIosSend, IoMdPhotos } from "react-icons/io";
import { RiInformationLine } from "react-icons/ri";
import { MdVideoCall, MdCallEnd, MdArrowBackIosNew } from "react-icons/md";

import logo from "../../../assets/logo/logo.png";
import { formatMessageTime, markConversationSeen } from "../../../lib/utils";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import FeedbackModal from "../../../modals/FeedbackModal";

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

  // --- Call related refs & state (LiveKit) ---
  const lkRoomRef = useRef(null); // LiveKit Room instance
  const localTracksRef = useRef([]); // array of LocalTracks
  const remoteVideoTrackRef = useRef(null); // last remote video track for detach
  const remoteAudioTrackRef = useRef(null); // last remote audio track for detach
  const roomNameRef = useRef(null); // current room name

  const localStreamRef = useRef(null); // only for local preview convenience
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const otherUserIdRef = useRef(null);
  const isCallerRef = useRef(false);
  const callStatusRef = useRef("idle"); // mirror of state to read inside socket handlers

  const [callVisible, setCallVisible] = useState(false);
  const [callStatus, setCallStatus] = useState("idle"); // 'idle'|'calling'|'ringing'|'in-call'
  const [incomingCaller, setIncomingCaller] = useState(null); // { from, name, signal }
  const [feedbackVisible, setFeedbackVisible] = useState(false);

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

  // ------------------ SOCKET CALL HANDLERS ------------------
  useEffect(() => {
    const socket = socketRef?.current;
    if (!socket) return;

    // incoming call from another user
    const incomingCallHandler = (data) => {
      // data (legacy/custom): { from, name, signal }
      // Here signal will carry LiveKit room info instead of SDP
      console.log("incomingCall", data);

      // If busy, decline automatically
      if (callStatusRef.current !== "idle") {
        socket.emit("declineCall", { to: data.from });
        return;
      }

      setIncomingCaller({
        from: data.from,
        name: data.name,
        signal: data.signal, // expected: { type: 'livekit', room: string }
      });
      otherUserIdRef.current = data.from;
      isCallerRef.current = false;
      setCallStatusSafe("ringing");
      setCallVisible(true);
    };

    // the callee accepted (LiveKit flow): simply transition UI to in-call
    const callAcceptedHandler = async () => {
      console.log("callAccepted (LiveKit) -> start in-call UI");
      setCallStatusSafe("in-call");
      setCallVisible(true);
    };

    const callDeclinedHandler = () => {
      console.log("callDeclined");
      // notify user and cleanup
      toast.error("Call was declined");
      cleanUpCall();
    };

    // Not needed in LiveKit flow; kept for compatibility (no-op)
    const iceCandidateHandler = async () => {
      // no-op in LiveKit flow
    };

    const endCallHandler = () => {
      console.log("endCall");
      toast.error("Call ended");
      setFeedbackVisible(true);
      cleanUpCall();
    };

    socket.on("incomingCall", incomingCallHandler);
    socket.on("callAccepted", callAcceptedHandler);
    socket.on("callDeclined", callDeclinedHandler);
    socket.on("iceCandidate", iceCandidateHandler);
    socket.on("endCall", endCallHandler);

    // helpful debug events
    socket.on("connect_error", (err) => {
      console.error("Socket connect_error:", err);
    });

    return () => {
      socket.off("incomingCall", incomingCallHandler);
      socket.off("callAccepted", callAcceptedHandler);
      socket.off("callDeclined", callDeclinedHandler);
      socket.off("iceCandidate", iceCandidateHandler);
      socket.off("endCall", endCallHandler);
    };
  }, [socketRef]); // eslint-disable-line react-hooks/exhaustive-deps

  // cleanup when component unmounts
  useEffect(() => {
    return () => {
      cleanUpCall();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------ CALL ACTIONS (LiveKit) ------------------
  const getRoomName = () => {
    // stable generated room for this pair
    const ids = [user.uid, selectedUser.uid].sort();
    return `ts_${ids[0]}_${ids[1]}`;
  };

  const connectLiveKit = async (roomName) => {
    try {
      // fetch token from backend
      const displayName = user.displayName || user.email || user.uid;
      const tokenRes = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/livekit/token?room=${encodeURIComponent(
          roomName
        )}&identity=${encodeURIComponent(user.uid)}&name=${encodeURIComponent(
          displayName
        )}`
      );
      if (!tokenRes.ok) throw new Error("Failed to get LiveKit token");
      const { url, token } = await tokenRes.json();

      const room = new Room();
      lkRoomRef.current = room;

      // subscribe to remote media
      room.on(RoomEvent.TrackSubscribed, (track) => {
        if (track.kind === Track.Kind.Video && remoteVideoRef.current) {
          remoteVideoTrackRef.current = track;
          track.attach(remoteVideoRef.current);
        }
        if (track.kind === Track.Kind.Audio) {
          remoteAudioTrackRef.current = track;
          // Attach to an audio element implicitly
          const audioEl = new Audio();
          track.attach(audioEl);
          audioEl.play().catch(() => undefined);
        }
      });
      room.on(RoomEvent.TrackUnsubscribed, (track) => {
        try {
          track.detach();
        } catch (e) {
          console.debug("Track detach error", e);
        }
      });
      room.on(RoomEvent.Disconnected, () => {
        console.log("LiveKit room disconnected");
      });

      // connect to LiveKit first
      await room.connect(url, token);

      // then create and publish local tracks
      const localTracks = await createLocalTracks({ audio: true, video: true });
      localTracksRef.current = localTracks;
      for (const t of localTracks) {
        await room.localParticipant.publishTrack(t);
      }

      // local preview
      const camTrack = localTracks.find((t) => t.kind === Track.Kind.Video);
      if (camTrack && localVideoRef.current) {
        // create a MediaStream for the <video/>
        const ms = new MediaStream([camTrack.mediaStreamTrack]);
        localStreamRef.current = ms;
        localVideoRef.current.srcObject = ms;
        try {
          await localVideoRef.current.play();
        } catch (e) {
          console.debug("Local video play() error", e);
        }
      }

      setCallStatusSafe("in-call");
      setCallVisible(true);
    } catch (err) {
      console.error("LiveKit connect error", err);
      toast.error("Unable to start call. Check camera/mic permissions.");
      throw err;
    }
  };

  const disconnectLiveKit = async () => {
    try {
      // detach remote
      try {
        if (remoteVideoTrackRef.current) {
          remoteVideoTrackRef.current.detach();
        }
        if (remoteAudioTrackRef.current) {
          remoteAudioTrackRef.current.detach();
        }
      } catch (e) {
        console.debug("Remote detach error", e);
      }

      // stop local preview
      if (localVideoRef.current) localVideoRef.current.srcObject = null;
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }

      // unpublish and stop local tracks
      if (lkRoomRef.current) {
        try {
          const room = lkRoomRef.current;
          const pubs = room?.localParticipant?.tracks;
          if (pubs && typeof pubs.values === "function") {
            for (const pub of pubs.values()) {
              try {
                if (pub?.track) {
                  await room.localParticipant.unpublishTrack(pub.track);
                  try {
                    pub.track.stop?.();
                  } catch (e) {
                    console.debug("Track stop after unpublish error", e);
                  }
                }
              } catch (e) {
                console.debug("Unpublish track error", e);
              }
            }
          }
        } catch (e) {
          console.debug("Error unpublishing tracks", e);
        }
        try {
          lkRoomRef.current.disconnect();
        } catch (e) {
          console.debug("Room disconnect error", e);
        }
        lkRoomRef.current = null;
      }
      for (const t of localTracksRef.current || []) {
        try {
          t.stop();
        } catch (e) {
          console.debug("Track stop error", e);
        }
      }
      localTracksRef.current = [];
    } catch (e) {
      console.warn("disconnectLiveKit error", e);
    }
  };

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
      const roomName = getRoomName();
      roomNameRef.current = roomName;

      // notify callee with room info via existing event
      socketRef.current.emit("callUser", {
        userToCall: otherUserIdRef.current,
        signalData: { type: "livekit", room: roomName },
        from: user.uid,
        name: user.displayName || user.email || user.uid,
      });

      // join LiveKit immediately; callee will join on accept
      await connectLiveKit(roomName);
    } catch {
      cleanUpCall();
    }
  };

  const acceptIncomingCall = async () => {
    try {
      const caller = incomingCaller;
      if (!caller) return;

      const roomName =
        caller?.signal?.room || roomNameRef.current || getRoomName();
      roomNameRef.current = roomName;

      await connectLiveKit(roomName);

      // notify caller to flip UI state
      socketRef.current.emit("acceptCall", {
        to: caller.from,
        signal: { accepted: true },
      });
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
    setFeedbackVisible(true);
    cleanUpCall();
  };

  // Clean up function (close pc, stop tracks, reset refs & state)
  const cleanUpCall = () => {
    setCallStatusSafe("idle");
    setCallVisible(false);
    setIncomingCaller(null);

    isCallerRef.current = false;
    otherUserIdRef.current = null;

    // disconnect LiveKit & cleanup
    disconnectLiveKit();

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
            initiateCall();
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
      {/* Feedback modal after call end */}
      <FeedbackModal
        visible={feedbackVisible}
        onClose={() => setFeedbackVisible(false)}
        onSubmitted={() => setFeedbackVisible(false)}
        fromUser={{ uid: user?.uid, name: user?.displayName || user?.email }}
        toUser={{
          uid: selectedUser?.uid,
          name:
            selectedUser?.name || selectedUser?.fullName || selectedUser?.email,
        }}
      />
    </div>
  );
};

export default ChatContainer;
