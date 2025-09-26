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
  const updateUserPassword = async (currentPassword, newPassword) => {
    try {
      if (!auth.currentUser) {
        throw new Error("No user is currently signed in.");
      }

      // Update the password
      await updatePassword(auth.currentUser, newPassword);

      return true;
    } catch (error) {
      console.error("Error updating password:", error.message);
      return { success: false, message: error.message };
    }
  };

  //re-authentic user
  const reauthenticateUser = async (password) => {
    if (!auth.currentUser) throw new Error("No user is signed in");
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      password
    );
    return reauthenticateWithCredential(auth.currentUser, credential);
  };

  // const verifyEmail = () => {
  //   return sendEmailVerification(auth.currentUser);
  // };

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
