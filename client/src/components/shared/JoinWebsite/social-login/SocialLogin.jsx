import React, { useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router";
import { setUserInDb } from "../../../../lib/utils";

const SocialLogin = () => {
  const { googleLogin, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  //navigate user
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await googleLogin();

      const user = res.user;

      const { displayName, email, photoURL, uid } = user;
      setUser({ displayName, email, photoURL, uid });

      // update user in db
      const userData = {
        name: res?.user?.displayName,
        email: res?.user?.email,
        image: res?.user?.photoURL,
        uid,
      };

      await setUserInDb(userData);

      // const firebaseToken = await user.getIdToken();
      toast.success("Logged in successfully with Google 🎉");

      navigate(from, { replace: true });
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(error.message || "Google login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-5">
      {/* Google */}
      <button
        onClick={handleGoogleLogin}
        className="btn bg-white text-black border-[#e5e5e5] w-full hover:bg-gray-100"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          <>
            <svg
              aria-label="Google logo"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <g>
                <path d="m0 0H512V512H0" fill="#fff"></path>
                <path
                  fill="#34a853"
                  d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                ></path>
                <path
                  fill="#4285f4"
                  d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                ></path>
                <path
                  fill="#fbbc02"
                  d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                ></path>
                <path
                  fill="#ea4335"
                  d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                ></path>
              </g>
            </svg>
            Login with Google
          </>
        )}
      </button>
    </div>
  );
};

export default SocialLogin;
