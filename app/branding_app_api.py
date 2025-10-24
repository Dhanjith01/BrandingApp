from fastapi import FastAPI,HTTPException
from branding_app import generate_branding_snippet,generate_keyword
from mangum import Mangum
from fastapi.middleware.cors import CORSMiddleware

#mangum wraps the entire api into a handler. pip install mangum

MAX_INPUT_LENGTH=32

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # allow requests from these origins
    allow_credentials=True,     # allow cookies, auth headers
    allow_methods=["*"],        # allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],        # allow all headers
)

handler=Mangum(app)
@app.get("/generate_snippet")
async def generate_snippet_api(prompt:str):
    validate_input_length(prompt)
    snippet=generate_branding_snippet(prompt)
    return {"snippet":snippet,"keyword":[]}

@app.get("/generate_keyword")
async def generate_keyword_api(prompt:str):
    validate_input_length(prompt)
    keyword=generate_keyword(prompt)
    return {"snippet":None,"keyword":keyword}

@app.get("/generate_snippet_and_keyword")
async def generate_keyword_api(prompt:str):
    validate_input_length(prompt)
    keyword=generate_keyword(prompt)
    snippet=generate_branding_snippet(prompt)
    return {"snippet":snippet,"keyword":keyword}

def validate_input_length(prompt:str):
    if len(prompt)>=MAX_INPUT_LENGTH:
        raise HTTPException(status_code=400,detail=f"Input length is too long. Must be under {MAX_INPUT_LENGTH} characters")