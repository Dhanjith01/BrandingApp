interface FormProps{
    prompt:string;
    setPrompt:any;
    onSubmit:any;
    isLoading:boolean;
    characterLimit:number;
}
const Form:React.FC<FormProps>=(props)=>{
    const characterLimit=props.characterLimit;
    const isPromptValid=props.prompt.length<=props.characterLimit;
    const updatePromptValue=(text:string)=>{
        if(text.length<=props.characterLimit){
            props.setPrompt(text);
        }
    }

    return(
        <>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
            Tell me what your brand is about and I will generate copy and keywords for you
        </p>
        <input 
            type="text" 
            placeholder="eg: coffee" 
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            value={props.prompt} 
            onChange={(e)=>updatePromptValue(e.currentTarget.value)}
        ></input>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {props.prompt.length}/{props.characterLimit}
        </div>

        <button type="submit" className={`w-full px-4 py-2 rounded font-semibold text-white ${props.isLoading || !isPromptValid? "bg-gray-400 cursor-not-allowed": "bg-indigo-600 hover:bg-indigo-700"}`} 
        onClick={props.onSubmit} disabled={props.isLoading||!isPromptValid}>
            Submit
        </button>
        </>
    )
}

export default Form;