import React, { useEffect, useMemo, useRef } from "react";
import {
  Bell,
  MessageSquare,
  Megaphone,
  UserPlus,
  CheckCheck,
} from "lucide-react";
import { useNavigate } from "react-router";
import useNotifications from "../../../hooks/useNotifications";
import useRole from "../../../hooks/useRole";
import useAuth from "../../../hooks/useAuth";

function typeMeta(n) {
  switch (n.type) {
    case "message":
      return {
        icon: MessageSquare,
        color: "text-blue-600",
        bg: "bg-blue-50",
        label: "New message",
      };
    case "follow":
      return {
        icon: UserPlus,
        color: "text-green-600",
        bg: "bg-green-50",
        label: "New follower",
      };
    case "announcement":
      return {
        icon: Megaphone,
        color: "text-amber-600",
        bg: "bg-amber-50",
        label: "Announcement",
      };
    default:
      return {
        icon: Bell,
        color: "text-gray-600",
        bg: "bg-gray-50",
        label: "Notification",
      };
  }
}

const isReadForUser = (n, uid) => {
  if (!n) return true;
  if (n.audience === "all") {
    return Array.isArray(n.readBy) && uid ? n.readBy.includes(uid) : false;
  }
  return !!n.readAt;
};

export default function NotificationBell() {
  const { items, unread, open, setOpen, loadMore, markRead, markAllRead } =
    useNotifications();
  const { role } = useRole();
  const listRef = useRef(null);
  const containerRef = useRef(null);
  const { user } = useAuth();
  const uid = user?.uid;
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (!containerRef.current) return;
      if (open && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open, setOpen]);

  // Infinite scroll within the list
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const onScroll = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) {
        loadMore();
      }
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [loadMore]);

  const goTo = (n) => {
    const meta = n?.meta || {};
    if (n.type === "message") {
      navigate("/dashboard/inbox");
    } else if (n.type === "follow") {
      const profileId = meta?.actorUid || meta?.fromUid || meta?.uid;
      if (profileId) navigate(`/profile/${profileId}`);
      else navigate("/dashboard/overview");
    } else if (n.type === "announcement") {
      if (role === "admin") navigate("/dashboard/admin/announcements");
      else navigate("/dashboard/overview");
    } else {
      navigate("/dashboard/overview");
    }
  };

  const BtnIcon = useMemo(() => Bell, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative"
        title="Notifications"
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
      >
        <BtnIcon size={20} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center ring-2 ring-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
            <div className="font-semibold text-gray-800">Notifications</div>
            <button
              onClick={markAllRead}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
              title="Mark all as read"
            >
              <CheckCheck size={14} /> Mark all
            </button>
          </div>

          <div ref={listRef} className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No notifications
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {items.map((n) => {
                  const m = typeMeta(n);
                  const Icon = m.icon;
                  const read = isReadForUser(n, uid);
                  return (
                    <li
                      key={n._id}
                      className={`px-3 py-2 hover:bg-gray-50 cursor-pointer ${
                        read ? "opacity-80" : "bg-blue-50/60"
                      }`}
                      onClick={() => {
                        markRead(n._id);
                        setOpen(false);
                        goTo(n);
                      }}
                    >
                      <div className="flex gap-3 items-start">
                        <div className={`mt-1 p-2 rounded-lg ${m.bg}`}>
                          <Icon size={16} className={m.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-800 truncate">
                            {m.label}
                          </div>
                          <div className="text-xs text-gray-600 line-clamp-2">
                            {n.text ||
                              n.message ||
                              n.title ||
                              "You have a new notification"}
                          </div>
                          {n.createdAt && (
                            <div className="mt-1 text-[10px] text-gray-400">
                              {new Date(n.createdAt).toLocaleString()}
                            </div>
                          )}
                        </div>
                        {!read && (
                          <span className="mt-2 w-2 h-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="px-3 py-2 text-[11px] text-gray-500 bg-gray-50 text-right">
            Tip: Click an item to open
          </div>
        </div>
      )}
    </div>
  );
}
