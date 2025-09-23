import React, { useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config/firebase.config";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // register/sign-up method for user
  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const authInfo = {
    user,
    createUser,
  };
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
