import { useEffect, useRef } from "react";
import { messagesDummyData } from "../../../assets/dummy-data/dummyData";
import { RxAvatar } from "react-icons/rx";
import { IoIosSend, IoMdPhotos } from "react-icons/io";
import { RiInformationLine } from "react-icons/ri";

import logo from "../../../assets/logo/logo.png";
import { formatMessageTime } from "../../../lib/utils";

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const scrollEnd = useRef();
  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  //   dummy data
  const profPic = "https://i.ibb.co.com/Ld3zWZrq/2148221808.jpg";
  return selectedUser ? (
    <div className="h-full overflow-scroll relative border-l border-r border-gray-300 bg-primary/5">
      {/* ---- header ---- */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-accent">
        <img
          src={profPic}
          alt=""
          className="w-8 aspect-[1/1] object-cover rounded-full"
        />
        <p className="flex-1 text-lg  flex items-center gap-2">
          Martin Johnson
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

      {/* ---- chat area --- */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messagesDummyData.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 justify-end ${
              msg.senderId !== "680f50e4f10f3cd28382ecf9" && "flex-row-reverse"
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
                  msg.senderId === "680f50e4f10f3cd28382ecf9"
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}
              >
                {msg.text}
              </p>
            )}

            <div className="text-center text-xs">
              <img
                src={
                  msg.senderId === "680f50e4f10f3cd28382ecf9" ? (
                    <RxAvatar />
                  ) : (
                    profPic
                  )
                }
                className="w-7 aspect-[1/1] object-cover rounded-full"
              />
              <p className="text-gray-500">
                {formatMessageTime(msg.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div ref={scrollEnd}></div>

      {/* ---------------------- bottom area --------------*/}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-primary/10 px-3 rounded-full">
          <input
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none  placeholder-gray-400"
          />
          <input type="file" id="image" accept="image/png, image/jpeg" hidden />
          <label htmlFor="image">
            <div className="w-5 mr-2 cursor-pointer text-primary">
              <IoMdPhotos />
            </div>
          </label>
        </div>
        <div className="w-7 cursor-pointer text-primary ">
          <IoIosSend className="hover:scale-150 transition-all duration-200 hover:text-accent" />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={logo} className="max-w-16" alt="" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
