"use client"; 
import React from "react";
import Form from "./Form";
import Results from "./Results";

const BrandingApp:React.FC=()=>{
    const CHARACTER_LIMIT=32;
    const[prompt,setPrompt]=React.useState("");
    const[snippet,setSnippet]=React.useState("");
    const[keyword,setKeyword]=React.useState([]);
    const[hasResult,setHasResult]=React.useState(false);
    const[isLoading,setIsLoading]=React.useState(false);

    const Endpoint:string="https://bo4vrsvac3.execute-api.us-east-1.amazonaws.com/prod/generate_snippet_and_keyword";
    const onSubmit=()=>{
        console.log("Submitting "+prompt);
        setIsLoading(true);
        fetch(`${Endpoint}?prompt=${prompt}`).then((res)=>res.json()).then(onResult);
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


    return( 
    <>  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                BrandingApp!
            </h1>
            <div className="w-full max-w-md mx-auto">
                {displayedElement}
            </div>
        </div>
    </>
    )
}
export default BrandingApp;