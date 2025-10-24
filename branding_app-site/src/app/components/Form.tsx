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
        <p>Tell me what your brand is about and I will generate copy and keywords for you</p>
        <input 
            type="text" 
            placeholder="coffee" 
            className="border border-black rounded" 
            value={props.prompt} 
            onChange={(e)=>updatePromptValue(e.currentTarget.value)}
        ></input>
        <div>{props.prompt.length}/{props.characterLimit}</div>
        <button type="submit" className="border border-black rounded" onClick={props.onSubmit} disabled={props.isLoading||!isPromptValid}>Submit</button>
        </>
    )
}

export default Form;