import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

const useAuth = () => {
  const authInfo = useContext(AuthContext);
  const [mongoUser, setMongoUser] = useState(null);
  const [loadingMongo, setLoadingMongo] = useState(true);

  const refreshMongoUser = async () => {
    if (!authInfo?.user?.email) {
      setMongoUser(null);
      setLoadingMongo(false);
      return;
    }

    try {
      setLoadingMongo(true);
      const response = await fetch(
<<<<<<< HEAD
<<<<<<< Updated upstream
        `http://localhost:5000/users/${authInfo.user.email}`
=======
        `${import.meta.env.VITE_API_URL}/users/${authInfo.user.email}`
>>>>>>> Stashed changes
=======
        `${import.meta.env.VITE_API_URL}/users/${authInfo.user.email}`
>>>>>>> e9ab4032b463353a7abc31fbc945f83783bedff0
      );
      const data = await response.json();

      if (data.success) {
        setMongoUser(data.user);
      } else {
        setMongoUser(null);
      }
    } catch (error) {
      console.error("Error fetching MongoDB user:", error);
      setMongoUser(null);
    } finally {
      setLoadingMongo(false);
    }
  };

  useEffect(() => {
    refreshMongoUser();
  }, [authInfo?.user]);

  return {
    ...authInfo,
    mongoUser,
    loadingMongo,
    refreshMongoUser,
  };
};

export default useAuth;
