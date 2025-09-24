import React from "react";
import logo from "../../assets/logo/logo.png";
import { Link } from "react-router";

const LogoSmallDevice = () => {
  return (
    <Link to={"/"}>
      <div className="hover:bg-base-300 rounded inline-block transition-all duration-300">
        <img src={logo} alt="logo_image" className="w-12" />
      </div>
    </Link>
  );
};

export default LogoSmallDevice;
