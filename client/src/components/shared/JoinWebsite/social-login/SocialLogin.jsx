import React, { useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { setUserInDb } from "../../../../lib/utils";
import Swal from "sweetalert2";

const SocialLogin = () => {
  const { googleLogin, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await googleLogin();
      const user = res.user;

      const { displayName, email, photoURL, uid } = user;
      setUser({ displayName, email, photoURL, uid });

      // save user in db
      const userData = {
        name: displayName,
        email,
        image: photoURL,
        uid,
      };
      await setUserInDb(userData);

      Swal.fire({
        title: "Login Successful! 🎉",
        text: "Where would you like to go?",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Complete Your Profile",
        cancelButtonText: "Go Home",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/onboarding");
        } else {
          navigate("/");
        }
      });
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(error.message || "Google login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="divider text-gray-400">OR</div>
      <button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl
                   bg-white/20 text-gray-800 font-medium shadow-md
                   hover:bg-white hover:scale-105 transition
                   duration-200 ease-in-out border border-gray-200"
      >
        {isLoading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          <>
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-6 h-6"
            />
            <span className="text-gray-700 font-semibold">
              Continue with Google
            </span>
          </>
        )}
      </button>
    </div>
  );
};

export default SocialLogin;
