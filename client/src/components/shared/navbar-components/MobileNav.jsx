//this component is for mobile devices only

import React, { useState } from "react";
import { Link, NavLink } from "react-router";
import { FiMenu } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import TalkSyncLogo from "../../logo/TalkSyncLogo";
import AuthBtnMobile from "./auth-buttons/AuthBtnMobile";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="lg:hidden">
      {/* open/close button + icon */}
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <MdClose size={30} /> : <FiMenu size={25} />}
      </button>

      {/* Sidebar including nav-links... */}
      <aside
        className={`absolute top-16 right-0 z-10 min-h-[calc(100vh-64px)] w-64 p-4 bg-white shadow-md transition-all duration-300 transform ${
          isOpen
            ? "translate-x-0 opacity-100 visible"
            : "translate-x-full opacity-0 invisible"
        }`}
      >
        {/* logo */}
        <div className="my-10">
          <TalkSyncLogo />
        </div>

        {/* aside links */}
        <ul className="flex flex-col items-start gap- my-12">
          {[
            { to: "/", label: "Home" },
            { to: "/about", label: "About Us" },
            { to: "/chat", label: "Chat" },
            { to: "/blogs", label: "Blogs" },
            { to: "/contact-us", label: "Contact Us" },
          ].map(({ to, label }) => (
            <li key={to} className="w-full">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `block px-6 py-2 w-full ${
                    isActive
                      ? "bg-accent/10 text-accent"
                      : "bg-none text-accent"
                  } transition-colors duration-300 text-lg font-medium`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* auth buttons */}
        <div className="mt-10">
          <AuthBtnMobile />
        </div>
      </aside>
    </div>
  );
};

export default MobileNav;
