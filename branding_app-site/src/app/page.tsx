"use client"
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { InitApp } from "./firebase";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";


export default function Home() {
  const router = useRouter();
  const app=InitApp();
  const auth=getAuth();
  const provider = new GoogleAuthProvider();
  provider.addScope('profile');
  provider.addScope('email');
  const signIn = async()=>{
    const result=await signInWithPopup(auth, provider);
    console.log(auth.currentUser?.email);
    router.push('/branding_app');
  }
  
  return (
    <>
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
    BrandingApp!
  </h1>
  <button 
    onClick={signIn}
    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium shadow-md transition-transform hover:scale-105"
  >
    Continue with Google
  </button>
</div>

    
    </>
  );
}
