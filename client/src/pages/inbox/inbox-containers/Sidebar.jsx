import logo from "../../../assets/logo/logo.png";
import { CiMenuKebab } from "react-icons/ci";
import { IoSearchOutline } from "react-icons/io5";
import useAuth from "../../../hooks/useAuth";
import { useState } from "react";
import { useEffect } from "react";
import {
  getFollowersByEmail,
  getFollowingByEmail,
  getUnreadCounts,
} from "../../../lib/utils";

const Sidebar = ({ selectedUser, setSelectedUser }) => {
  const { onlineUsers, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState("following"); // following | followers
  const [query, setQuery] = useState("");
  const [unreadMap, setUnreadMap] = useState({}); // { senderId: count }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!user?.email) return;
        if (tab === "following") {
          const list = await getFollowingByEmail(user.email);
          setUsers(list);
        } else {
          const list = await getFollowersByEmail(user.email);
          setUsers(list);
        }
        // fetch unread counts for the logged-in user
        if (user?.uid) {
          try {
            const counts = await getUnreadCounts(user.uid);
            setUnreadMap(counts);
          } catch {
            // ignore errors silently for sidebar
          }
        }
      } catch (err) {
        console.error("Failed to fetch sidebar users:", err);
      }
    };
    fetchUsers();
  }, [user, tab]);
  return (
    <div
      className={`bg-base-100/60 backdrop-blur-lg h-full p-4 md:p-5 rounded-r-xl overflow-y-auto ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <p className="font-bold text-lg text-secondary">
            Talk<span className="text-primary">Sync</span>
          </p>
          <div className="relative py-2 group">
            <span className="max-h-5 cursor-pointer">
              <CiMenuKebab />
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4 grid grid-cols-2 gap-1 text-xs rounded-lg bg-base-200 p-1">
          <button
            className={`py-2 rounded-md ${
              tab === "following" ? "bg-base-100 shadow" : "opacity-70"
            }`}
            onClick={() => setTab("following")}
          >
            Following
          </button>
          <button
            className={`py-2 rounded-md ${
              tab === "followers" ? "bg-base-100 shadow" : "opacity-70"
            }`}
            onClick={() => setTab("followers")}
          >
            Followers
          </button>
        </div>

        <div className="bg-base-300/70 rounded-full flex items-center gap-2 py-2.5 px-4 mt-4">
          <IoSearchOutline size={20} />
          <input
            type="text"
            className="bg-transparent border-none outline-none text-xs flex-1"
            placeholder="Search user by name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {users
          .filter((u) => {
            if (!query.trim()) return true;
            const q = query.trim().toLowerCase();
            const name = (u.name || u.fullName || "").toLowerCase();
            const email = (u.email || "").toLowerCase();
            return name.includes(q) || email.includes(q);
          })
          .map((u, index) => (
            <div
              key={u._id || u.uid || index}
              onClick={() => setSelectedUser(u)}
              className={`relative flex items-center gap-3 p-2 pl-4 rounded-lg cursor-pointer max-sm:text-sm hover:bg-base-200/60 transition ${
                selectedUser?._id === u._id ? "bg-primary/20" : ""
              }`}
            >
              <img
                src={u.image || logo}
                alt=""
                className="w-[36px] h-[36px] object-cover rounded-full"
              />
              <div className="flex flex-col leading-5">
                <p>{u.name || u.fullName}</p>
                <span
                  className={`${
                    onlineUsers.includes(u.uid)
                      ? "text-green-400"
                      : "text-neutral-500"
                  } text-xs`}
                >
                  {onlineUsers.includes(u.uid) ? "Online" : "Offline"}
                </span>
              </div>

              {/* Unread count badge (only number circle) */}
              {unreadMap[u.uid] > 0 ? (
                <span className="ml-auto mr-2 text-[10px] h-5 min-w-5 px-1 flex justify-center items-center rounded-full bg-primary text-white">
                  {unreadMap[u.uid]}
                </span>
              ) : (
                <span
                  className={`ml-auto mr-2 w-2 h-2 rounded-full ${
                    onlineUsers.includes(u.uid)
                      ? "bg-green-500"
                      : "bg-transparent"
                  }`}
                />
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Sidebar;
