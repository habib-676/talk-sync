// TalkSyncSignup.jsx
import React, { useState } from "react";
import { Mail, Lock, User, EyeOff, Eye } from "lucide-react";
import Lottie from "lottie-react";
import languageAnimation from "./register.json";
import { Link } from "react-router";
import TalkSyncLogo from "../../../logo/TalkSyncLogo";
import useAuth from "../../../../hooks/useAuth";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../loading/LoadingSpinner";
import { updateProfile } from "firebase/auth";
import { auth } from "../../../../firebase-config/firebase.config";
import SocialLogin from "../social-login/SocialLogin";
import { useForm } from "react-hook-form";

export default function SignUp() {
  const { createUser, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const onSubmit = (data) => {
    const { user_name, user_email, password } = data;
    setLoading(true);

    // create user with email and password - firebase
    createUser(user_email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User created:", user);
        return updateProfile(user, { displayName: user_name });
      })
      .then(() => {
        setUser(auth.currentUser);
        reset();
        toast.success("Registration Successful");
      })
      .catch((error) => {
        console.error("Registration error:", error);
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div className="relative">
              <User className="absolute left-3 top-3 text-accent" size={20} />
              <input
                type="text"
                placeholder="John Doe"
                {...register("user_name", { required: "Name is required" })}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 text-accent placeholder-accent border border-white/30 focus:outline-none focus:ring-2 focus:ring-success"
              />
              {errors.user_name && (
                <p className="text-error text-sm mt-1">
                  {errors.user_name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-accent" size={20} />
              <input
                type="email"
                placeholder="user@example.com"
                {...register("user_email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                    message: "Invalid email format!",
                  },
                })}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 text-accent placeholder-accent border border-white/30 focus:outline-none focus:ring-2 focus:ring-success"
              />
              {errors.user_email && (
                <p className="text-error text-sm mt-1">
                  {errors.user_email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-accent" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).*$/,
                    message:
                      "Password must include an uppercase letter, a number, and a special character",
                  },
                })}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 text-accent placeholder-accent border border-white/30 focus:outline-none focus:ring-2 focus:ring-success"
              />
              {errors.password && (
                <p className="text-error text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
              {/* show/hide password */}
              <button
                type="button"
                className="absolute right-3 top-3 text-accent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-accent" size={20} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                {...register("confirm_password", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 text-accent placeholder-accent border border-white/30 focus:outline-none focus:ring-2 focus:ring-success"
              />
              {errors.confirm_password && (
                <p className="text-error text-sm mt-1">
                  {errors.confirm_password.message}
                </p>
              )}
              {/* show/hide confirm password */}
              <button
                type="button"
                className="absolute right-3 top-3 text-accent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-base-100 font-semibold shadow-lg hover:scale-105 hover:shadow-pink-500/30 transition"
            >
              {loading ? <LoadingSpinner /> : "Create Account"}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-gray-700 mt-6">
            Already have an account?{" "}
            <Link to="/auth/signin" className="text-success hover:underline">
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
