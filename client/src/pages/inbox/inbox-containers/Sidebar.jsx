import logo from "../../../assets/logo/logo.png";
import { CiMenuKebab } from "react-icons/ci";
import { IoSearchOutline } from "react-icons/io5";
import useAuth from "../../../hooks/useAuth";
import { useState } from "react";
import { useEffect } from "react";

const Sidebar = ({ selectedUser, setSelectedUser }) => {
  const { onlineUsers, user } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users`);
        const data = await res.json();
        // optional: filter yourself out if you want
        const others = data.filter((u) => u.uid !== user?.uid);
        setUsers(others);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, [user]);
  return (
    <div
      className={`backdrop-blur-lg  h-full p-5 rounded-r-xl overflow-y-scroll ${
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

        <div className="bg-base-300/90 rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <IoSearchOutline size={20} />
          <input
            type="text"
            className="bg-transparent border-none outline-none text-xs flex-1"
            placeholder="Search User..."
          />
        </div>
      </div>

      <div className="flex flex-col">
        {users.map((u, index) => (
          <div
            key={u._id || u.uid || index}
            onClick={() => setSelectedUser(u)}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
              selectedUser?._id === u._id && "bg-primary/20"
            }`}
          >
            <img
              src={u.image || logo}
              alt=""
              className="w-[35px] aspect-[1/1] object-cover rounded-full"
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

            {!onlineUsers.includes(u.uid) && (
              <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
                {index}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
