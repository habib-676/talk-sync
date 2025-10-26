import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import axiosSecure from "./useAxiosSecure";

const useRole = () => {
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