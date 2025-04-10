"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    // Check for token and role
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      // If no token, redirect to login
      router.push("/login");
    } else if (role === "Team member") {
      // If the user is a team member, redirect to the team dashboard
      router.push("/team");
    } 
    else {
        router.push("/admin");
    }
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* Rest of your dashboard content */}
    </div>
  );
};

export default Dashboard;
