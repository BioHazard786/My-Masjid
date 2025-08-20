import { authClient } from "@/apps/mobile/lib/auth-client";

export const useAuth = () => {
  const {
    data: session,
    isPending: isLoading,
    refetch,
  } = authClient.useSession();

  const user = session?.user || null;
  const isAuthenticated = !!user;

  return {
    user,
    isLoading,
    isAuthenticated,
    refetch,
  };
};
