// TalkSyncSignup.jsx
import React from "react";
import { Mail, Lock, User } from "lucide-react";
import Lottie from "lottie-react";
import languageAnimation from "./register.json"; // same or different lottie
import { Link } from "react-router";
import TalkSyncLogo from "../../../logo/TalkSyncLogo";

export default function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-300 via-purple-300 to-pink-200 p-6">
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        
        {/* Left: Signup Form */}
        <div className="flex flex-col justify-center p-10">
          {/* Logo + Title */}
         <div className="flex flex-col items-center mb-10">
            <TalkSyncLogo className="mx-auto" /> {/* ✅ matches login page */}
            <p className="text-gray-200 text-base mt-2 text-center">
              Create your account & start practicing 🌍
            </p>
          </div>

          <form className="space-y-5">
            {/* Name */}
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-300" size={20} />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-300" size={20} />
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-300" size={20} />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-300" size={20} />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-pink-500/30 transition"
            >
              Create Account
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-gray-200 mt-6">
            Already have an account?{" "}
            
            <Link to='/auth/login' className="text-pink-300 hover:underline">
            Sign In
            </Link>
          </p>
        </div>

        {/* Right: Lottie Animation */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-white/20 to-white/5">
          <div className="text-center p-10">
            <h2 className="text-3xl font-bold text-white mb-4">
              Join TalkSync Today 💬
            </h2>
            <p className="text-gray-200 mb-6 ml-10 mr-10">
              Connect instantly with people worldwide and improve your speaking
              skills with real-time conversations.
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
