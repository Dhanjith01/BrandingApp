"use client"
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { InitApp } from "./firebase";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";


export default function Home() {
  const router = useRouter();
  const app=InitApp();
  const auth=getAuth();
  const provider = new GoogleAuthProvider();
  provider.addScope('profile');
  provider.addScope('email');
  const [loading, setLoading] = React.useState(false);
  const signIn = async()=>{
    if (loading) return; // prevent double click
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(auth.currentUser?.email);
      router.push("/branding_app");
    } 
    catch (error) {
      console.error("Sign-in failed:", error);
      setLoading(false); // re-enable button if failed
    }
  }
  
  return (
    <>
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
    BrandingApp!
  </h1>
  <button 
    onClick={signIn}
    className={`px-6 py-3 rounded-lg text-lg font-medium shadow-md transition-transform ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white hover:scale-105"
        }`}
  >
    Continue with Google
  </button>
</div>

    
    </>
  );
}
