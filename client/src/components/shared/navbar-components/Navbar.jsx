import React from "react";
import MobileNav from "./MobileNav";
import AuthButtons from "./auth-buttons/AuthButtons";
import DesktopNav from "./DesktopNav";
import TalkSyncLogo from "../../logo/TalkSyncLogo";
import LogoSmallDevice from "../../logo/LogoSmallDevice";
import useAuth from "../../../hooks/useAuth";

const Navbar = () => {
  const { user } = useAuth();
  console.log(user);
  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-base-100 text-base-content shadow-md">
      <div className="maximum-w px-4 h-full mx-auto flex items-center justify-between">
        {/* logo ⬇ */}
        <div className="hidden sm:block">
          <TalkSyncLogo />
        </div>
        <div className="sm:hidden">
          <LogoSmallDevice />
        </div>

        {/* sidebar and nav-links  for small devices ⬇ */}
        <MobileNav />

        {/* nav-links for large devices ⬇ */}
        <DesktopNav user={user} />

        {/* auth buttons for larger devices ⬇ */}
        <AuthButtons />
      </div>
    </nav>
  );
};

export default Navbar;
