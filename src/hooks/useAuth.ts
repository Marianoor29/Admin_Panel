import { useEffect } from "react";
import { useRouter } from "next/navigation";

const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("tokenExpiry");

    if (!token || !expiry) {
      // No token or expiry in storage, redirect to login
      router.push("/login");
      return;
    }

    const expiryDate = new Date(expiry);
    const currentDate = new Date();

    // Compare the timestamps (milliseconds since the epoch)
    if (expiryDate.getTime() <= currentDate.getTime()) {
      // Token has expired, log the user out
      logoutUser();
    } else {
      // Set a timeout to automatically log the user out when the token expires
      const timeUntilExpiry = expiryDate.getTime() - currentDate.getTime();
      setTimeout(() => {
        logoutUser();
      }, timeUntilExpiry);
    }
  }, [router]);

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("role");
    localStorage.removeItem("tokenExpiry");
    router.push("/login"); // Redirect to login page
  };

  return null;
};

export default useAuth;
