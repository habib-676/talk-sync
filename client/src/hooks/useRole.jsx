import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import axiosSecure from "./useAxiosSecure";

const useRole = () => {
<<<<<<< HEAD
<<<<<<< Updated upstream
  const { user } = useAuth();
  const email = user?.email;
  console.log("email from useRole", email);
=======
  const { user, loading } = useAuth();
>>>>>>> e9ab4032b463353a7abc31fbc945f83783bedff0

  const { data: role, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["user-role"],
    enabled: !!user?.email && !loading, 
    retry: 1,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await axiosSecure.get("/user-role");
      return res.data?.role;
    },
  });

  return { role, isLoading, isError, error, refetch };
};

export default useRole;
<<<<<<< HEAD
=======
  const { user, loading } = useAuth();

  const { data: role, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["user-role"],
    enabled: !!user?.email && !loading, 
    retry: 1,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await axiosSecure.get("/user-role");
      return res.data?.role;
    },
  });

  return { role, isLoading, isError, error, refetch };
};

export default useRole;
;
>>>>>>> Stashed changes
=======
;
>>>>>>> e9ab4032b463353a7abc31fbc945f83783bedff0
