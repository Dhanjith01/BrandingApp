# BrandingApp 🚀  
An AI-powered branding assistant that generates marketing snippets and keywords using LLaMA-3.1-8B-Instant via the Groq API.

## 🧠 Features
- Generate creative marketing snippets and keywords from user prompts.  
- Google Authentication using Firebase for secure user login.  
- FastAPI backend that verifies JWT tokens before processing requests.  
- Serverless backend deployed on **AWS Lambda (API Gateway)** for scalability.  
- Frontend built with **Next.js (TypeScript)** and hosted on **Vercel**.  
- Email delivery via **SMTP** to send generated snippets and keywords to users.

## 🧩 Tech Stack
**Frontend:** Next.js (TypeScript), Tailwind CSS  
**Backend:** FastAPI, Python  
**Auth:** Firebase (Google Provider, JWT Verification)  
**AI Model:** LLaMA-3.1-8B-Instant (Groq API)  
**Deployment:** AWS Lambda, Vercel  
**Email:** SMTP, `email.mime`