// TalkSyncLogin.jsx
import React, { useState } from "react";
import { Mail, Lock, EyeOff, Eye } from "lucide-react";
import Lottie from "lottie-react";
import languageAnimation from "./Login.json"; // your Lottie file
import { Link, useNavigate } from "react-router";
import TalkSyncLogo from "../../../logo/TalkSyncLogo";
import useAuth from "../../../../hooks/useAuth";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../../../loading/LoadingSpinner";
import SocialLogin from "../social-login/SocialLogin";
import { setUserInDb } from "../../../../lib/utils";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, resetPassword } = useAuth();

  //navigate to dashboard/homepage after login
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.target;
    const email = form.user_email.value;
    const password = form.password.value;

    console.log({ email, password });

    await signIn(email, password)
      .then(async (result) => {
        const loggedUser = result.user;
        console.log(loggedUser);
        setIsLoading(false);
        const userData = {
          uid: loggedUser?.uid,
          name: loggedUser?.displayName || "Anonymous",
          email: loggedUser?.email,
        };

        // Save or update user in DB
        await setUserInDb(userData);
        form.reset();
        toast.success("Login Successful!");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error during sign-in:", error);
        setIsLoading(false);
        toast.error(`Login Failed! ${error.message}`);
      });
  };

  const handleResetPassword = () => {
    const email = document.querySelector('input[name="user_email"]').value;
    if (!email) {
      toast.error("Please enter your email address to reset password.");
      return;
    }
    resetPassword(email)
      .then(() => {
        toast.success("Password reset email sent! Check your inbox.");
      })
      .catch((error) => {
        console.error("Error sending password reset email:", error);
        toast.error("Failed to send password reset email. Try again.");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-300 via-purple-300 to-pink-200 p-6">
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        {/* Left: Login Form */}
        <div className="flex flex-col justify-center p-10">
          {/* Logo + Title */}
          <div className="flex flex-col items-center mb-10">
            <TalkSyncLogo className="mx-auto" /> {/* ✅ logo center */}
            <p className="text-gray-200 text-base mt-2 text-center">
              Connect. Practice. Speak. 🌍
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-accent" size={20} />
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 text-accent placeholder-accent border border-white/30 focus:outline-none focus:ring-2 focus:ring-success"
                name="user_email"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-accent" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 text-accent placeholder-accent border border-white/30 focus:outline-none focus:ring-2 focus:ring-success"
                name="password"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-accent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-gray-200 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-pink-500" />
                Remember me
              </label>
              <button
                type="button"
                className=" text-gray-800 cursor-pointer hover:underline"
                onClick={handleResetPassword}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-pink-500/30 transition"
            >
              {isLoading ? <LoadingSpinner /> : "Login"}
            </button>
          </form>

          <SocialLogin />

          {/* Signup link */}
          <p className="text-center text-gray-800 mt-6">
            Don’t have an account?{" "}
            <Link to="/auth/register" className="text-success hover:underline">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Right: Lottie Animation */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-white/20 to-white/5">
          <div className="text-center p-10">
            <h2 className="text-3xl font-bold text-white mb-4 ml-5 mr-5">
              Practice Languages in Real-Time 💬
            </h2>
            <p className="text-gray-200 mb-6 ml-10 mr-10">
              TalkSync helps you connect with partners around the world to
              improve speaking through video, audio, and chat.
            </p>
            <Lottie
              animationData={languageAnimation}
              loop={true}
              className="w-127 mx-auto drop-shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
