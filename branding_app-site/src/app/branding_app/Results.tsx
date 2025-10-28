interface ResultProps{
    snippet:string;
    keyword:string[];
    onBack:any;
    prompt:string;
}
const Results:React.FC<ResultProps>=(props)=>{
    
    const keywordElements=[];
    for(let i=0;i<props.keyword.length;i++){
        const element=<div key={i}>#{props.keyword[i]}</div>;
        keywordElements.push(element);
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