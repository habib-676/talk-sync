import React from "react";
import MobileNav from "./MobileNav";
import AuthButtons from "./auth-buttons/AuthButtons";
import DesktopNav from "./Desktopnav";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-base-100 text-base-content shadow-md">
      <div className="max-w-7xl px-4 h-full mx-auto flex items-center justify-between">
        {/* logo ⬇ */}
        <div className="flex items-center gap-2">
          <h2 className="text-2xl text-primary font-bold">TalkSync</h2>
        </div>

        {/* sidebar and nav-links  for small devices ⬇ */}
        <MobileNav />

        {/* nav-links for large devices ⬇ */}
        <DesktopNav />

        {/* auth buttons for larger devices ⬇ */}
        <AuthButtons />
      </div>
    </nav>
  );
};

export default Navbar;
