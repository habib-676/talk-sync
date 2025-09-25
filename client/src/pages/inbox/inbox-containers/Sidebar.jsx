import logo from "../../../assets/logo/logo.png";
import { userDummyData } from "../../../assets/dummy-data/dummyData";
import { CiMenuKebab } from "react-icons/ci";
import { IoSearchOutline } from "react-icons/io5";

const Sidebar = ({ selectedUser, setSelectedUser }) => {
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
        {userDummyData.map((user, index) => (
          <div
            key={index}
            onClick={() => {
              setSelectedUser(user);
            }}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
              selectedUser?._id === user._id && "bg-primary/20"
            }`}
          >
            <img
              src={user.profilePic || logo}
              alt=""
              className="w-[35px] aspect-[1/1] object-cover rounded-full"
            />
            <div className="flex flex-col leading-5">
              <p>{user.fullName}</p>
              {index < 3 ? (
                <span className="text-green-400 text-xs">Online</span>
              ) : (
                <span className="text-neutral-500 text-xs">Offline</span>
              )}
            </div>

            {index > 2 && (
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
