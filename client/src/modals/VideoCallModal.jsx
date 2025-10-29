import { useEffect, useState } from "react";
import {
  MdMic,
  MdMicOff,
  MdVideocam,
  MdVideocamOff,
  MdCall,
  MdCallEnd,
  MdScreenShare,
  MdChatBubbleOutline,
  MdMoreHoriz,
} from "react-icons/md";

const VideoCallModal = ({
  visible,
  status,
  callerName,
  calleeName,
  // isCaller is not used in this UI but kept compatible for prop shape
  onAccept,
  onDecline,
  onEnd,
  onCancel,
  localVideoRef,
  remoteVideoRef,
}) => {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  useEffect(() => {
    if (!visible) {
      setMicOn(true);
      setCamOn(true);
    }
  }, [visible]);

  // Pretty time like 11:35
  const d = new Date();
  const nowText = `${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  if (!visible) return null;

  const showIncoming = status === "ringing";
  const showCalling = status === "calling";
  const showInCall = status === "in-call";

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 text-white">
      {/* Main remote video area */}
      <div className="absolute inset-0">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        {/* Subtle gradient overlay for control contrast */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
      </div>

      {/* Header (top bar) */}
      <div className="absolute top-0 left-0 right-0 h-12 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm opacity-90">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/70" />
          <span>{nowText}</span>
        </div>
      </div>

      {/* Local self-view (PiP) */}
      <div className="absolute bottom-24 right-4 md:bottom-24 md:right-6">
        <div className="relative w-28 h-20 sm:w-40 sm:h-28 rounded-lg overflow-hidden shadow-lg border border-white/10 bg-black/40">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${camOn ? "" : "opacity-0"}`}
          />
          {!camOn && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs">
              Camera off
            </div>
          )}
        </div>
      </div>

      {/* Centered status text for calling/ringing */}
      {(showCalling || showIncoming) && (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="text-center">
            <p className="text-lg font-medium">
              {showCalling && `Calling ${calleeName || "..."}`}
              {showIncoming && `Incoming call from ${callerName || "Unknown"}`}
            </p>
            <p className="mt-2 text-white/70 text-sm">
              {showCalling
                ? "Ringing… waiting for answer"
                : "Answer or decline"}
            </p>

            {showIncoming && (
              <div className="mt-6 flex items-center justify-center gap-6">
                <button
                  onClick={onAccept}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-600 hover:bg-green-500 flex items-center justify-center shadow-lg"
                  title="Accept"
                >
                  <MdCall className="text-white" size={26} />
                </button>
                <button
                  onClick={onDecline}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center shadow-lg"
                  title="Decline"
                >
                  <MdCallEnd className="text-white" size={26} />
                </button>
              </div>
            )}

            {showCalling && (
              <div className="mt-6">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white text-sm shadow"
                >
                  Cancel call
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom controls */}
      <div className="absolute left-0 right-0 bottom-0 px-4 sm:px-6 pb-4 pt-3">
        <div className="flex items-center justify-between">
          {/* Left small status */}
          <div className="text-xs sm:text-sm text-white/80">
            {nowText}
            {showInCall && <span className="ml-2">| 2 people in the call</span>}
          </div>

          {/* Center controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setMicOn((v) => !v)}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center"
              title={micOn ? "Mute" : "Unmute"}
            >
              {micOn ? (
                <MdMic size={22} />
              ) : (
                <MdMicOff size={22} className="text-red-400" />
              )}
            </button>
            <button
              onClick={() => setCamOn((v) => !v)}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center"
              title={camOn ? "Turn camera off" : "Turn camera on"}
            >
              {camOn ? (
                <MdVideocam size={22} />
              ) : (
                <MdVideocamOff size={22} className="text-red-400" />
              )}
            </button>
            {showInCall ? (
              <button
                onClick={onEnd}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center shadow-lg"
                title="End call"
              >
                <MdCallEnd size={24} className="text-white" />
              </button>
            ) : showCalling ? (
              <button
                onClick={onCancel}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center shadow-lg"
                title="Cancel call"
              >
                <MdCallEnd size={24} className="text-white" />
              </button>
            ) : null}
            {/* Extras (visual only) */}
            <button
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center"
              title="Share screen"
            >
              <MdScreenShare size={22} />
            </button>
            <button
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur hidden md:flex items-center justify-center"
              title="Chat"
            >
              <MdChatBubbleOutline size={22} />
            </button>
          </div>

          {/* Right placeholder */}
          <div className="hidden sm:flex items-center gap-2 opacity-80">
            <MdMoreHoriz size={22} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;
