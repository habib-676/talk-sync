import React from "react";
import logo from "../../assets/logo/logo.png";
import { Link } from "react-router";
const LogoForFooter = () => {
  return (
    <Link to={"/"} className="flex items-center gap-2">
      <div className="flex items-center">
        <img src={logo} alt="" className="w-16" />
        <h2 className="text-3xl text-base-100 font-bold">TalkSync</h2>
      </div>
    </Link>
  );
};

export default LogoForFooter;
