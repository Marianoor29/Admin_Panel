"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import Loader from "@/components/Loader";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedAttempts = localStorage.getItem("failedAttempts");
    const lockTime = localStorage.getItem("lockTime");

    if (savedAttempts && lockTime) {
      const attempts = parseInt(savedAttempts, 10);
      const lockTimestamp = parseInt(lockTime, 10);
      const currentTime = new Date().getTime();

      // Check if 30 minutes have passed since the lock
      if (attempts >= 3 && currentTime - lockTimestamp < 30 * 60 * 1000) {
        setIsLocked(true);
      } else {
        localStorage.removeItem("failedAttempts");
        localStorage.removeItem("lockTime");
      }
    }
  }, []);

  // Inside your handleLogin function
  const handleLogin = async () => {
    if (isLocked) return; 

    setLoading(true);
    try {
      const response = await fetch("https://www.offerboats.com/team/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      const token = data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("userName", userName);
      localStorage.setItem("role", data.type);

        const decoded = jwtDecode(token);

        if (decoded.exp) {
          const expiryDate = new Date(decoded.exp * 1000);
          localStorage.setItem("tokenExpiry", expiryDate.toISOString());
            // Automatically log out the user after the token expires
      const expirationTime = decoded.exp * 1000 - Date.now(); 
      setTimeout(() => {
        logoutUser();
      }, expirationTime);
        } else {
          console.error("Token does not have an expiration date.");
        }

      if (data.type === "Admin") {
        router.push("/admin");
      } else if (data.type === "Team member") {
        router.push("/team");
      }

      localStorage.removeItem("failedAttempts");
      localStorage.removeItem("lockTime");

    } catch (error: any) {
      console.error("Login error:", error);
      alert(error.message);
      // Handle failed attempts
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);
      if (attempts >= 3) {
        const lockTime = new Date().getTime();
        localStorage.setItem("failedAttempts", attempts.toString());
        localStorage.setItem("lockTime", lockTime.toString());
        setIsLocked(true);
      } else {
        localStorage.setItem("failedAttempts", attempts.toString());
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to logout user
const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
  localStorage.removeItem("role");
  localStorage.removeItem("tokenExpiry");
  router.push("/login");
};

  return (
    <div className="bg-white flex flex-col items-center justify-center min-h-screen relative">
      <Loader state={loading} />

      {/* Centering both logo and form */}
      <div className="flex flex-col items-center">
        {/* Logo */}
        <Image src="/logo.png" alt="OfferBoat Admin Panel" width={150} height={150} />

        {/* Login form */}
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg mb-6">
          <h1 className="text-l font-bold mb-1 text-center">Login</h1>
          {isLocked ? (
            <p className="text-red-500 text-center mb-4">
              Too many failed attempts. Please try again after 30 minutes.
            </p>
          ) : (
            <>
              <input
                type="text"
                placeholder="Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-2 mb-2 border rounded"
                disabled={isLocked || loading}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 mb-2 border rounded"
                disabled={isLocked || loading}
              />
              <button
                onClick={handleLogin}
                className="w-full p-2 bg-blue-500 text-white rounded"
                disabled={isLocked || loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Disclaimer fixed at the bottom */}
      <div className="bottom-0 w-full">
        <p className="text-sm text-red-700 text-justify p-5">
          This website is intended solely for authorized users of Offerboat or its designated partners. Unauthorized access is strictly prohibited. Only individuals with valid credentials issued by Offerboat may enter this site. All activities on this site are logged and monitored for security purposes. If you are not an authorized user, please exit immediately. Unauthorized use or attempts to gain unauthorized access may result in legal action.
        </p>
      </div>
    </div>
  );
};

export default Login;
