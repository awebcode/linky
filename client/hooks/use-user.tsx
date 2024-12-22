import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";
import { toast } from "./use-toast";
export const useUser = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoading = status === "loading";
  const user = session?.user; // This will be undefined or null if not authenticated

  useEffect(() => {
    if (!isLoading && !user) {
      // If not authenticated and not loading, redirect to login page
      router.push("/");
    }
  }, [isLoading, user, router]);

  return {
    user: user as Omit<User, "password">,
    isLoading: false,
    isAuthenticated: true,
  };
};

export const handleLogout = async () => {
  // Show a toast notification indicating the user has logged out
  toast({
    title: "You have been logged out.",
    description: "You will be redirected to the home page.",
  });

  // Sign out and redirect to the home page
  await signOut({ redirectTo: "/" }); // prevent automatic redirect from signOut
};
