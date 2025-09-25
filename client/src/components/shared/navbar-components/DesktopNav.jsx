// this component is for desktop devices only

import React from "react";
import { NavLink } from "react-router";

const DesktopNav = ({ user }) => {
  console.log("DesktopNav user:", user);
  const menuItems = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/inbox", label: "Inbox" },
    { to: "/blogs", label: "Blogs" },
    { to: "/contact-us", label: "Contact Us" },
  ];

  // Conditionally add Dashboard link if user is logged in
  if (user) {
    menuItems.push({ to: "/dashboard", label: "Dashboard" });
  }
  return (
    <ul className="hidden lg:flex items-center">
      {menuItems.map(({ to, label }) => (
        <li key={to}>
          <NavLink
            className={({ isActive }) =>
              `px-6 py-2 ${
                isActive ? "bg-accent/10 text-accent" : "bg-none text-accent"
              } transition-colors duration-300 text-lg font-medium`
            }
            to={to}
          >
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default DesktopNav;
