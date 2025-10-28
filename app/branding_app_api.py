from fastapi import FastAPI,HTTPException,Header, Depends
from branding_app import generate_branding_snippet,generate_keyword
from mangum import Mangum
from fastapi.middleware.cors import CORSMiddleware
from firebase_admin import credentials, auth, initialize_app
import os
import json
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

firebase_config = os.getenv("FIREBASE_CONFIG")
if firebase_config:
    cred = credentials.Certificate(json.loads(firebase_config))
    initialize_app(cred)
else:
    raise RuntimeError("Missing FIREBASE_CONFIG environment variable")   
   
async def verify_firebase_token(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header format")
    token = authorization.split("Bearer ")[1]
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        print("❌ Token verification failed:", e)
        raise HTTPException(status_code=401, detail="Invalid or expired token")  


handler=Mangum(app)
@app.get("/generate_snippet")
async def generate_snippet_api(prompt:str,user=Depends(verify_firebase_token)):
    validate_input_length(prompt)
    snippet=generate_branding_snippet(prompt)
    return {"snippet":snippet,"keyword":[]}

@app.get("/generate_keyword")
async def generate_keyword_api(prompt:str,user=Depends(verify_firebase_token)):
    validate_input_length(prompt)
    keyword=generate_keyword(prompt)
    return {"snippet":None,"keyword":keyword}

@app.get("/generate_snippet_and_keyword")
async def generate_snippet_and_keyword_api(prompt:str,user=Depends(verify_firebase_token)):
    validate_input_length(prompt)
    keyword=generate_keyword(prompt)
    snippet=generate_branding_snippet(prompt)
    return {"snippet":snippet,"keyword":keyword}

def validate_input_length(prompt:str):
    if len(prompt)>=MAX_INPUT_LENGTH:
        raise HTTPException(status_code=400,detail=f"Input length is too long. Must be under {MAX_INPUT_LENGTH} characters")