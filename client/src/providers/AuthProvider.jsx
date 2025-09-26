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

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log("user in auth provider:", user);

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
      return await signInWithEmailAndPassword(auth, email, password);
    } finally {
      setLoading(false);
    }
  };

  //sign out method for user
  const logOut = () => {
    return signOut(auth);
  };

  //social login methods (Google, GitHub, etc.) can be added here
  const googleLogin = async () => {
    setLoading(true);
    try {
      return await signInWithPopup(auth, googleProvider);
    } finally {
      setLoading(false);
    }
  };

  //password reset and email verification methods can be added here
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  //update password methods can be added here

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
  };
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
