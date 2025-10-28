from fastapi import FastAPI,HTTPException,Header, Depends
from branding_app import generate_branding_snippet,generate_keyword
from mangum import Mangum
from fastapi.middleware.cors import CORSMiddleware
from firebase_admin import credentials, auth, initialize_app
import os
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
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
    
def validate_input_length(prompt:str):
    if len(prompt)>=MAX_INPUT_LENGTH:
        raise HTTPException(status_code=400,detail=f"Input length is too long. Must be under {MAX_INPUT_LENGTH} characters")
    
# Gmail credentials from environment
GMAIL_USER =os.getenv("GMAIL_USER")
GMAIL_APP_PASSWORD =os.getenv("GMAIL_APP_PASSWORD")


def send_email(recipient: str, subject: str, html_body: str):
    """Send HTML email using Gmail SMTP."""
    msg = MIMEMultipart("alternative")
    msg["From"] = GMAIL_USER
    msg["To"] = recipient
    msg["Subject"] = subject
    msg.attach(MIMEText(html_body, "html"))

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
        server.send_message(msg)

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

@app.post("/send_results")
def send_results(data: dict, user=Depends(verify_firebase_token)):
    """Send a styled email with branding results to the logged-in user."""
    to_email = user["email"]
    prompt = data.get("prompt", "")
    snippet = data.get("snippet", "")
    keywords = ", ".join(data.get("keywords", []))

    # ✅ HTML with inline CSS (safe for Gmail/Outlook)
    html_body = f"""
    <!DOCTYPE html>
    <html>
      <body style="font-family:Inter,Arial,sans-serif;background-color:#f3f4f6;color:#111827;padding:20px;margin:0;">
        <div style="background:linear-gradient(to bottom right,#ffffff,#f9fafb);border-radius:12px;padding:32px;max-width:620px;margin:0 auto;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
          <div style="text-align:center;color:#4f46e5;font-size:26px;font-weight:700;margin-bottom:8px;">Branding App ✨</div>
          <div style="text-align:center;color:#6b7280;font-size:14px;margin-bottom:24px;">Smart ideas. Beautiful brands.</div>

          <div style="line-height:1.7;color:#374151;">
            <p>Hi there 👋,</p>
            <p>Your branding snippet has been generated successfully based on your prompt:</p>

            <div style="color:#6b7280;font-size:14px;font-weight:600;margin-top:16px;text-transform:uppercase;">Prompt</div>
            <div style="background-color:#eef2ff;color:#3730a3;padding:10px 12px;border-radius:8px;font-weight:500;margin:8px 0;display:inline-block;">{prompt}</div>

            <div style="color:#6b7280;font-size:14px;font-weight:600;margin-top:16px;text-transform:uppercase;">Snippet</div>
            <div style="background-color:#eef2ff;color:#3730a3;padding:10px 12px;border-radius:8px;font-weight:500;margin:8px 0;display:inline-block;">{snippet}</div>

            <div style="color:#6b7280;font-size:14px;font-weight:600;margin-top:16px;text-transform:uppercase;">Keywords</div>
            <div style="background-color:#eef2ff;color:#3730a3;padding:10px 12px;border-radius:8px;font-weight:500;margin:8px 0;display:inline-block;">{keywords}</div>

            <a href="https://branding-app-puce.vercel.app/" style="display:inline-block;margin-top:28px;background:linear-gradient(to right,#6366f1,#8b5cf6);color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;transition:opacity 0.2s ease-in-out;">Open Branding App</a>
          </div>

          <div style="margin-top:32px;font-size:12px;color:#6b7280;text-align:center;border-top:1px solid #e5e7eb;padding-top:16px;">
            © 2025 Branding App — Made with 💜 by Dhanjith Velluva
          </div>
        </div>
      </body>
    </html>
    """

    try:
        send_email(
            recipient=to_email,
            subject="Your Branding App Results ✨",
            html_body=html_body,
        )
        return {"status": "sent", "recipient": to_email}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))