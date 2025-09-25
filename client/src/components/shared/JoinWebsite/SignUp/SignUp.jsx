// TalkSyncSignup.jsx
import React, { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import Lottie from "lottie-react";
import languageAnimation from "./register.json"; // same or different lottie
import { Link } from "react-router";
import TalkSyncLogo from "../../../logo/TalkSyncLogo";
import useAuth from "../../../../hooks/useAuth";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../loading/LoadingSpinner";
import { updateProfile } from "firebase/auth";
import { auth } from "../../../../firebase-config/firebase.config";
import SocialLogin from "../social-login/SocialLogin";

export default function SignUp() {
  const { createUser, setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignUp = (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const formData = new FormData(form);
    const newUser = Object.fromEntries(formData.entries());

    const { user_name, user_email, password, confirm_password } = newUser;

    console.log({ user_name, user_email, password, confirm_password });

    // Form Validation
    // if (password.length < 6) {
    //   setLoading(false);
    //   return toast.error("Password must be at least 6 character long");
    // }

    // // password complexity validation
    // const passValidation = (password) => {
    //   const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
    //   return regex.test(password);
    // };

    // if (!passValidation(password)) {
    //   setLoading(false);
    //   return toast.error(
    //     "Password must have 1 uppercase, 1 lowercase, 1 special character and 1 number"
    //   );
    // }

    // if (password !== confirm_password) {
    //   setLoading(false);
    //   return toast.error("Password and Confirm Password Should be Same");
    // }

    createUser(user_email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        return updateProfile(user, { displayName: user_name });
      })
      .then(() => {
        setUser(auth.currentUser);
        form.reset();
        toast.success("Registration Successful");
      })
      .catch((error) => {
        console.error("Registration error:", error);

        // Handle ALL errors in one place
        if (error.code === "auth/email-already-in-use") {
          toast.error("Email already exists. Please use another email.");
        } else if (error.code === "auth/weak-password") {
          toast.error("Weak password. Please choose a stronger password.");
        } else if (error.code === "auth/invalid-email") {
          toast.error("Invalid email address format.");
        } else {
          toast.error("Registration failed! Try Again!");
        }
      })
      .finally(() => setLoading(false));
  };

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

          <SocialLogin />

          <form onSubmit={handleSignUp} className="space-y-5">
            {/* Name */}
            <div className="relative">
              <User className="absolute left-3 top-3 text-accent" size={20} />
              <input
                type="text"
                placeholder="John Doe"
                name="user_name"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 text-accent placeholder-accent border border-white/30 focus:outline-none focus:ring-2 focus:ring-success"
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-accent" size={20} />
              <input
                type="email"
                placeholder="user@example.com"
                name="user_email"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 text-accent placeholder-accent border border-white/30 focus:outline-none focus:ring-2 focus:ring-success"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-accent" size={20} />
              <input
                type="password"
                placeholder="Password"
                name="password"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 text-accent placeholder-accent border border-white/30 focus:outline-none focus:ring-2 focus:ring-success"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-accent" size={20} />
              <input
                type="password"
                placeholder="Confirm Password"
                name="confirm_password"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 text-accent placeholder-accent border border-white/30 focus:outline-none focus:ring-2 focus:ring-success"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-base-100 font-semibold shadow-lg hover:scale-105 hover:shadow-pink-500/30 transition"
            >
              {loading ? <LoadingSpinner /> : "Create Account"}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-gray-700 mt-6">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-success hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        {/* Right: Lottie Animation */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-white/20 to-white/5">
          <div className="text-center p-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Join TalkSync Today 💬
            </h2>
            <p className="text-gray-600 mb-6 ml-10 mr-10">
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
