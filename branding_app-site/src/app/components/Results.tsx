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
        <div>
            <div>
                <div>
                    <b>Prompt</b>
                </div>
                <div>
                    {props.prompt}
                </div>
            </div>
            <div>
                <div>
                    <b>Snippet</b>
                </div>
                <div>
                    {props.snippet}
                </div>
            </div>
            <div>
                <div>
                    <b>Keywords</b>
                </div>
                <div>
                    {keywordElements}
                </div>
            </div>
        </div>
        <button onClick={props.onBack}>Back</button>
        </>
    )
}

export default Results;