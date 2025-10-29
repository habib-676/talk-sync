/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Room, RoomEvent, Track, createLocalTracks } from "livekit-client";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import VideoCallModal from "../modals/VideoCallModal";
import FeedbackModal from "../modals/FeedbackModal";

const CallContext = createContext(null);

export const useCall = () => useContext(CallContext);

const initialState = {
  status: "idle", // 'idle' | 'calling' | 'ringing' | 'in-call'
  visible: false,
};

const CallProvider = ({ children }) => {
  const { user, socketRef, onlineUsers } = useAuth();

  // UI state
  const [callState, setCallState] = useState(initialState);
  const [incomingCaller, setIncomingCaller] = useState(null); // { from, name, signal }
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackCtx, setFeedbackCtx] = useState(null); // { fromUser, toUser }

  // Refs
  const isCallerRef = useRef(false);
  const otherUserIdRef = useRef(null);
  const otherUserInfoRef = useRef(null); // { uid, name }
  const callStatusRef = useRef("idle");

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // LiveKit refs
  const lkRoomRef = useRef(null);
  const localTracksRef = useRef([]);
  const remoteVideoTrackRef = useRef(null);
  const remoteAudioTrackRef = useRef(null);
  const localStreamRef = useRef(null);
  const roomNameRef = useRef(null);

  const setCallStatusSafe = (s) => {
    callStatusRef.current = s;
    setCallState((prev) => ({ ...prev, status: s }));
  };

  const setVisible = (v) => setCallState((prev) => ({ ...prev, visible: v }));

  // Stable room name for both users
  const getRoomName = (a, b) => {
    const ids = [a, b].sort();
    return `ts_${ids[0]}_${ids[1]}`;
  };

  // ------------- LiveKit helpers -------------
  const connectLiveKit = useCallback(
    async (roomName) => {
      try {
        const displayName = user?.displayName || user?.email || user?.uid;
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

        room.on(RoomEvent.TrackSubscribed, (track) => {
          if (track.kind === Track.Kind.Video && remoteVideoRef.current) {
            remoteVideoTrackRef.current = track;
            track.attach(remoteVideoRef.current);
          }
          if (track.kind === Track.Kind.Audio) {
            remoteAudioTrackRef.current = track;
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
          // no-op; cleanup handled elsewhere
        });

        await room.connect(url, token);

        const localTracks = await createLocalTracks({
          audio: true,
          video: true,
        });
        localTracksRef.current = localTracks;
        for (const t of localTracks) {
          await room.localParticipant.publishTrack(t);
        }

        const camTrack = localTracks.find((t) => t.kind === Track.Kind.Video);
        if (camTrack && localVideoRef.current) {
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
        setVisible(true);
      } catch (e) {
        console.error("LiveKit connect error", e);
        toast.error("Unable to start call. Check camera/mic permissions.");
        throw e;
      }
    },
    [user]
  );

  const disconnectLiveKit = useCallback(async () => {
    try {
      try {
        if (remoteVideoTrackRef.current) remoteVideoTrackRef.current.detach();
        if (remoteAudioTrackRef.current) remoteAudioTrackRef.current.detach();
      } catch (e) {
        console.debug("Remote detach error", e);
      }

      if (localVideoRef.current) localVideoRef.current.srcObject = null;
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }

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
  }, []);

  // Centralized teardown available to effects/callbacks below
  const cleanUpCall = useCallback(() => {
    setCallStatusSafe("idle");
    setVisible(false);
    setIncomingCaller(null);
    isCallerRef.current = false;
    otherUserIdRef.current = null;
    otherUserInfoRef.current = null;

    disconnectLiveKit();

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  }, [disconnectLiveKit]);

  // ------------- Socket listeners -------------
  useEffect(() => {
    const socket = socketRef?.current;
    if (!socket || !user) return;

    const incomingCallHandler = (data) => {
      // If busy, auto-decline
      if (callStatusRef.current !== "idle") {
        socket.emit("declineCall", { to: data.from });
        return;
      }
      setIncomingCaller({
        from: data.from,
        name: data.name,
        signal: data.signal,
      });
      isCallerRef.current = false;
      otherUserIdRef.current = data.from;
      otherUserInfoRef.current = { uid: data.from, name: data.name };
      setCallStatusSafe("ringing");
      setVisible(true);
    };

    const callAcceptedHandler = async () => {
      try {
        const roomName =
          roomNameRef.current || getRoomName(user.uid, otherUserIdRef.current);
        await connectLiveKit(roomName);
      } catch (e) {
        console.error("callAccepted connect error", e);
        cleanUpCall();
      }
    };

    const callDeclinedHandler = () => {
      toast.error("Call was declined");
      cleanUpCall();
    };

    const endCallHandler = () => {
      toast.error("Call ended");
      // snapshot users for feedback before cleanup
      const toUserSnap = otherUserInfoRef.current
        ? { ...otherUserInfoRef.current }
        : incomingCaller
        ? { uid: incomingCaller.from, name: incomingCaller.name }
        : null;
      setFeedbackCtx({
        fromUser: { uid: user?.uid, name: user?.displayName || user?.email },
        toUser: toUserSnap,
      });
      setFeedbackVisible(true);
      cleanUpCall();
    };

    socket.on("incomingCall", incomingCallHandler);
    socket.on("callAccepted", callAcceptedHandler);
    socket.on("callDeclined", callDeclinedHandler);
    socket.on("endCall", endCallHandler);

    return () => {
      socket.off("incomingCall", incomingCallHandler);
      socket.off("callAccepted", callAcceptedHandler);
      socket.off("callDeclined", callDeclinedHandler);
      socket.off("endCall", endCallHandler);
    };
  }, [socketRef, user, connectLiveKit, cleanUpCall, incomingCaller]);

  // Cleanup on unmount
  useEffect(
    () => () => {
      cleanUpCall();
    },
    [cleanUpCall]
  );

  // ------------- Actions -------------
  const initiateCall = useCallback(
    async (targetUser) => {
      if (!user || !targetUser) {
        toast.error("Select a user to call");
        return;
      }
      if (!onlineUsers?.includes(targetUser.uid)) {
        toast.error("User is offline");
        return;
      }

      isCallerRef.current = true;
      otherUserIdRef.current = targetUser.uid;
      otherUserInfoRef.current = {
        uid: targetUser.uid,
        name:
          targetUser.name ||
          targetUser.fullName ||
          targetUser.email ||
          targetUser.uid,
      };
      setCallStatusSafe("calling");
      setVisible(true);

      try {
        const roomName = getRoomName(user.uid, targetUser.uid);
        roomNameRef.current = roomName;

        socketRef.current.emit("callUser", {
          userToCall: targetUser.uid,
          signalData: { type: "livekit", room: roomName },
          from: user.uid,
          name: user.displayName || user.email || user.uid,
        });
        // Wait for accept to connect
      } catch (e) {
        console.error("initiateCall error", e);
        cleanUpCall();
      }
    },
    [onlineUsers, socketRef, user, cleanUpCall]
  );

  const accept = useCallback(async () => {
    try {
      const caller = incomingCaller;
      if (!caller) return;
      const roomName =
        caller?.signal?.room ||
        roomNameRef.current ||
        getRoomName(user.uid, caller.from);
      roomNameRef.current = roomName;
      await connectLiveKit(roomName);
      socketRef.current.emit("acceptCall", {
        to: caller.from,
        signal: { accepted: true },
      });
    } catch (e) {
      console.error("accept error", e);
      toast.error("Unable to accept call. Check camera/mic permissions.");
      cleanUpCall();
    }
  }, [connectLiveKit, incomingCaller, socketRef, user, cleanUpCall]);

  const decline = useCallback(() => {
    const to = incomingCaller?.from || otherUserIdRef.current;
    if (to) socketRef.current.emit("declineCall", { to });
    cleanUpCall();
  }, [incomingCaller, socketRef, cleanUpCall]);

  const cancel = useCallback(() => {
    // caller cancels before connected
    const to = otherUserIdRef.current;
    if (to) socketRef.current.emit("declineCall", { to });
    cleanUpCall();
  }, [socketRef, cleanUpCall]);

  const end = useCallback(() => {
    const to = isCallerRef.current
      ? otherUserIdRef.current
      : incomingCaller?.from;
    if (to) socketRef.current.emit("endCall", { to });
    // snapshot users for feedback before cleanup
    const toUserSnap = otherUserInfoRef.current
      ? { ...otherUserInfoRef.current }
      : incomingCaller
      ? { uid: incomingCaller.from, name: incomingCaller.name }
      : null;
    setFeedbackCtx({
      fromUser: { uid: user?.uid, name: user?.displayName || user?.email },
      toUser: toUserSnap,
    });
    setFeedbackVisible(true);
    cleanUpCall();
  }, [incomingCaller, socketRef, cleanUpCall, user]);

  const contextValue = useMemo(
    () => ({
      // state
      callVisible: callState.visible,
      callStatus: callState.status,
      incomingCaller,
      isCaller: isCallerRef.current,
      targetUser: otherUserInfoRef.current,
      // actions
      initiateCall,
      accept,
      decline,
      cancel,
      end,
    }),
    [
      callState.visible,
      callState.status,
      incomingCaller,
      initiateCall,
      accept,
      decline,
      cancel,
      end,
    ]
  );

  const callerName = incomingCaller?.name;
  const calleeName = otherUserInfoRef.current?.name;

  return (
    <CallContext.Provider value={contextValue}>
      {children}
      <VideoCallModal
        visible={callState.visible}
        status={callState.status}
        callerName={callerName}
        calleeName={calleeName}
        isCaller={isCallerRef.current}
        onAccept={accept}
        onDecline={decline}
        onEnd={end}
        onCancel={cancel}
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
      />
      <FeedbackModal
        visible={feedbackVisible}
        onClose={() => setFeedbackVisible(false)}
        onSubmitted={() => setFeedbackVisible(false)}
        fromUser={
          feedbackCtx?.fromUser || {
            uid: user?.uid,
            name: user?.displayName || user?.email,
          }
        }
        toUser={
          feedbackCtx?.toUser || {
            uid: otherUserInfoRef.current?.uid,
            name: calleeName,
          }
        }
      />
    </CallContext.Provider>
  );
};

export default CallProvider;
