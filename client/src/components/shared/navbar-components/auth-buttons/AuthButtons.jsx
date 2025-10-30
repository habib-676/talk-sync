import React from "react";
import { Link } from "react-router";
import useAuth from "../../../../hooks/useAuth";
import toast from "react-hot-toast";
import {
  LogOut,
  User as UserIcon,
  LayoutDashboard,
  Bot,
  Copy,
} from "lucide-react";

const AuthButtons = () => {
  const { user, logOut } = useAuth();

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error during logout");
    }
  };

  const copyEmail = async () => {
    try {
      if (user?.email) {
        await navigator.clipboard.writeText(user.email);
        toast.success("Email copied");
      }
    } catch {
      toast.error("Failed to copy");
    }
  };

  // Avatar image fallback
  const avatarSrc = user?.photoURL || "/default-avatar.png";
  const displayName = user?.displayName || "User";

  return (
    <div className="flex items-center gap-3">
      {user ? (
        <div className="dropdown dropdown-end">
          {/* Trigger */}
          <button
            tabIndex={0}
            className="btn btn-ghost btn-circle relative"
            aria-haspopup="menu"
            aria-label="User menu"
          >
            {/* avatar ring */}
            <div className="avatar">
              <div className="w-10 rounded-full ring ring-primary/60 ring-offset-2 ring-offset-base-100">
                <img src={avatarSrc} alt={displayName} />
              </div>
            </div>
            
          </button>

          {/* Menu */}
          <ul
            tabIndex={0}
            className="mt-3 z-[1] w-72 p-0 dropdown-content bg-base-100/95 backdrop-blur shadow-xl rounded-2xl border border-base-200"
            role="menu"
          >
            {/* Profile header card */}
            <li className="p-4" role="none">
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="w-12 rounded-full ring ring-primary/60 ring-offset-2 ring-offset-base-100">
                    <img src={avatarSrc} alt={displayName} />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold leading-tight truncate">{displayName}</p>
                  {user?.email && (
                    <div className="flex items-center gap-2 text-xs opacity-70">
                      <span className="truncate">{user.email}</span>
                      <button
                        onClick={copyEmail}
                        className="btn btn-ghost btn-xxs btn-circle"
                        title="Copy email"
                        aria-label="Copy email"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>

            <li className="px-4">
              <div className="divider my-0"></div>
            </li>

            {/* Actions */}
           
            <li role="none">
              <Link
                to="/dashboard"
                role="menuitem"
                className="flex items-center gap-3 px-4 py-3 hover:bg-base-200/60 transition"
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li role="none">
              <Link
                to="/aiAgent"
                role="menuitem"
                className="flex items-center gap-3 px-4 py-3 hover:bg-base-200/60 transition"
              >
                <Bot size={18} />
                <span>TalkSync AI</span>
              </Link>
            </li>
            

            <li className="px-4">
              <div className="divider my-0"></div>
            </li>

            <li role="none">
              <button
                onClick={handleLogout}
                role="menuitem"
                className="flex w-full items-center gap-3 px-4 py-3 text-error hover:bg-error/10 transition"
              >
                <LogOut size={18} />
                <span>Log out</span>
              </button>
            </li>
          </ul>
        </div>
      ) : (
        // Logged-out state
        <div className="hidden lg:flex gap-3">
          <Link to="/auth/signin">
            <button className="btn btn-primary normal-case px-4">
              Sign In
            </button>
          </Link>
          <Link to="/auth/register">
            <button className="btn btn-outline normal-case px-4">
              Sign Up
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AuthButtons;
