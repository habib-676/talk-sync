import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import axiosSecure from "./useAxiosSecure";

const useRole = () => {
  const { user } = useAuth();
  const email = user?.email;
  console.log("email from useRole", email);

  const {
    data: role,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user-role", email],
    queryFn: async () => {
      if (!email) return null;
      const res = await axiosSecure.get(`/user-role/${email}`);
      console.log("Role API response:", res.data);
      return res.data.role;
    },
    enabled: !!email,
  });

  return { role, isLoading, refetch };
};

export default useRole;
