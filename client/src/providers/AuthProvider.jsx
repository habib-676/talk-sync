import React, { useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword,
} from "firebase/auth";
import { auth } from "../firebase-config/firebase.config";
import { useRef } from "react";
import { io } from "socket.io-client";

const googleProvider = new GoogleAuthProvider();
const SOCKET_URL = `${import.meta.env.VITE_API_URL}`; // backend URL

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  console.log("user in auth provider:", user);

  // -------- SOCKET HANDLERS --------
  const connectSocket = (uid) => {
    if (socketRef.current?.connected) return; // already connected

    socketRef.current = io(SOCKET_URL, {
      query: { uid },
    });

    socketRef.current.on("connect", () => {
      console.log("🟢 Socket connected:", socketRef.current.id);
    });

    socketRef.current.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
    });

    // listen online users from server
    socketRef.current.on("getOnlineUsers", (userIds) => {
      console.log("Online users:", userIds);
      setOnlineUsers(userIds);
    });
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  // register/sign-up method for user
  const createUser = async (email, password) => {
    setLoading(true);
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } finally {
      setLoading(false);
    }
  };

  //sign-in method for user
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      connectSocket(userCredential.user.uid); // connect socket on login
      return userCredential;
    } finally {
      setLoading(false);
    }
  };

  //sign out method for user
  const logOut = async () => {
    await signOut(auth);
    disconnectSocket(); // disconnect socket on logout
    setUser(null);
  };

  //social login methods (Google, GitHub, etc.) can be added here
  const googleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      connectSocket(userCredential.user.uid); // connect socket on Google login
      return userCredential;
    } finally {
      setLoading(false);
    }
  };

  //password reset and email verification methods can be added here
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  //step - 1:re-authenticate user
  const reauthenticateUser = async (password) => {
    if (!auth.currentUser) throw new Error("No user is signed in");
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      password
    );
    return reauthenticateWithCredential(auth.currentUser, credential);
  };

  // step-2: update password
  const updateUserPassword = async (currentPassword, newPassword) => {
    setLoading(true);
    try {
      if (!auth.currentUser) {
        throw new Error("No user is currently signed in.");
      }

      await reauthenticateUser(currentPassword);
      await updatePassword(auth.currentUser, newPassword);

      return { success: true, message: "Password updated successfully!" };
    } catch (error) {
      console.error("Error updating password:", error);

      //handle firebase errors
      let errorMessage = error.message;
      if (error.code === "auth/wrong-password") {
        errorMessage = "Current password is incorrect.";
      } else if (error.code === "auth/weak-password") {
        errorMessage =
          "New password is too weak. Please use a stronger password.";
      } else if (error.code === "auth/requires-recent-login") {
        errorMessage = "Please log in again to change your password.";
      }

      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // observe auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      console.log("Auth state changed, current user:", currentUser);

      // socket logic
      if (currentUser) {
        connectSocket(currentUser.uid); // auto-connect if user is already logged in
      } else {
        disconnectSocket();
      }
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    createUser,
    signIn,
    logOut,
    googleLogin,
    setUser,
    resetPassword,
    loading,
    setLoading,
    updateUserPassword,
    reauthenticateUser,
    socketRef,
    onlineUsers,
  };
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
