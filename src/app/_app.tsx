"use client"; // if you're in an app directory, otherwise not needed in /pages

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { AppProps } from "next/app"; // make sure you're importing correctly
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const token = localStorage.getItem("token");

    // If no token and on the homepage, redirect to login
    if (!token && pathname === "/") {
      router.push("/login");
    } else {
      setLoading(false); 
    }
  }, [pathname, router]);

  // Show loading while the effect runs
  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>OfferBoat</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;



