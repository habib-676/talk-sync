import React from "react";
import logo from "../../assets/logo/logo.png";
import { Link } from "react-router";

const TalkSyncLogo = () => {
  return (
    <Link to={"/"} className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <img src={logo} alt="" className="w-10 h-10" />
        <h2 className="text-3xl text-primary font-extrabold pb-1">TalkSync</h2>
      </div>
    </Link>
  );
};

export default TalkSyncLogo;
