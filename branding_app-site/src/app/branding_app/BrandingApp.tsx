"use client"; 
import { useRouter } from 'next/navigation';
import React from "react";
import Form from "./Form";
import Results from "./Results";
import { InitApp } from "../firebase";
import { getAuth } from "firebase/auth";
const BrandingApp:React.FC=()=>{
  const router = useRouter();
    const app=InitApp();
    const auth=getAuth();
    const CHARACTER_LIMIT=32;
    const[prompt,setPrompt]=React.useState("");
    const[snippet,setSnippet]=React.useState("");
    const[keyword,setKeyword]=React.useState([]);
    const[hasResult,setHasResult]=React.useState(false);
    const[isLoading,setIsLoading]=React.useState(false);
    const [token, setToken] = React.useState<string | null>(null);
    const [authReady, setAuthReady] = React.useState(false);
    const Endpoint:string=process.env.NEXT_PUBLIC_API_ENDPOINT_GEN!;

    React.useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          const idToken = await user.getIdToken();
          setToken(idToken);
        }
        setAuthReady(true);
      });
      return unsubscribe;
    }, [auth]);

    const onSubmit=async()=>{
        if (!authReady) {
          console.warn("Auth not ready yet — try again shortly");
          return;
        }
        const idToken = token || (await auth.currentUser?.getIdToken());
        if (!idToken) {
          console.error("No token available yet");
          return;
        }

        console.log("Submitting "+prompt);
        setIsLoading(true);
        fetch(`${Endpoint}?prompt=${prompt}`,{
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // send token
          },
        }).then((res)=>res.json()).then(onResult);
    };

    const onResult=(data:any)=>{
        setSnippet(data.snippet);
        setKeyword(data.keyword);
        setHasResult(true);
        setIsLoading(false)
    };

    const onReset=(data:any)=>{
        setPrompt("");
        setHasResult(false);
        setIsLoading(false)
    };

    let displayedElement=null;
    if(hasResult){
        displayedElement=<Results snippet={snippet} keyword={keyword} onBack={onReset} prompt={prompt}/>
    }
    else{
        displayedElement=<Form prompt={prompt} setPrompt={setPrompt} onSubmit={onSubmit} isLoading={isLoading} characterLimit={CHARACTER_LIMIT}/>;
    }

    const logOut=()=>{
      console.log(`${auth.currentUser?.email} signed out`);
      auth.signOut();
      router.push("/");
    }


    return( 

    <>  
<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
  {/* User Info Card */}
  <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-2xl px-6 py-4 mb-8 flex items-center justify-between border border-gray-100 dark:border-gray-700">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
        {auth.currentUser?.email?.[0]?.toUpperCase()}
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-gray-500 dark:text-gray-400">Signed in as</span>
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {auth.currentUser?.email}
        </span>
      </div>
    </div>

    <button
      onClick={logOut}
      className="text-xs font-medium bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-all duration-200 shadow-sm"
    >
      Sign Out
    </button>
  </div>

  {/* Branding Section */}
  <div className="w-full max-w-md text-center">
    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
      BrandingApp!
    </h1>
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
      {displayedElement}
    </div>
  </div>
</div>

    </>
    )
}
export default BrandingApp;