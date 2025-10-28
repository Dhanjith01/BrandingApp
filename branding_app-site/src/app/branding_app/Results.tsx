import { getAuth } from "firebase/auth";
import { InitApp } from "../firebase";
import { useState } from "react";

interface ResultProps{
    snippet:string;
    keyword:string[];
    onBack:any;
    prompt:string;
}
const Results:React.FC<ResultProps>=(props)=>{
    const app=InitApp();
    const auth=getAuth();
    const [isSending, setIsSending] = useState(false);
    const Endpoint:string=process.env.NEXT_PUBLIC_API_ENDPOINT_SEND!;
    const sendEmail = async () => {
      setIsSending(true);
      const data = {
        prompt: props.prompt,
        snippet: props.snippet,
        keywords: props.keyword.map((kw) => `#${kw}`),
      };
      const token=await auth.currentUser?.getIdToken();
      const response = await fetch(
        `${Endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        alert("✅ Email sent successfully!");
      } 
      else {
        const errorText = await response.text();
        alert(`❌ Failed to send email: ${errorText}`);
      }
      setIsSending(false);
    }

    return(
        <>
        <div className="flex flex-col gap-4">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded shadow-sm">
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">Prompt</div>
              <div className="mt-1 text-gray-900 dark:text-white">{props.prompt}</div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded shadow-sm">
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">Snippet</div>
              <div className="mt-1 text-gray-900 dark:text-white">{props.snippet}</div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded shadow-sm">
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">Keywords</div>
              <div className="mt-1 flex flex-wrap gap-2">
                {props.keyword.map((kw, i) => (
                  <div
                    key={i}
                    className="bg-indigo-100 dark:bg-indigo-600 text-indigo-800 dark:text-white px-2 py-1 rounded-full text-sm"
                  >
                    #{kw}
                  </div>
                ))}
              </div>
            </div>
            
            <button
              disabled={isSending}
              onClick={sendEmail}
              className={`px-4 py-2 rounded text-white transition-colors
                ${
                  isSending
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
            >
              {isSending ? "Sending..." : "Send Email"}
            </button>
            
            <button
              className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 dark:text-white hover:bg-gray-400"
              onClick={props.onBack}
            >
              Back
            </button>
        </div>

        </>
    )
}

export default Results;