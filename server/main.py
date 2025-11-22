from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, validator
import resend
import os
from dotenv import load_dotenv
from email_templates import get_user_confirmation_email, get_admin_notification_email

load_dotenv()

app = FastAPI(title="NoRa EV API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://noraevtech.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Resend
resend.api_key = os.getenv("RESEND_API_KEY")

class PreOrderRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str
    city: str

    @validator('name')
    def validate_name(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError('name must be at least 2 characters')
        return v.strip()

    @validator('phone')
    def validate_phone(cls, v):
        # Remove common phone number characters
        cleaned = ''.join(filter(str.isdigit, v))
        if len(cleaned) < 10:
            raise ValueError('phone number must be at least 10 digits')
        return v.strip()

    @validator('city')
    def validate_city(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError('city must be at least 2 characters')
        return v.strip()


@app.get("/")
async def root():
    return {"message": "NoRa EV API is running", "status": "healthy"}


@app.post("/api/pre-order")
async def submit_pre_order(request: PreOrderRequest):
    try:
        # Send confirmation email to user
        user_email_html = get_user_confirmation_email(
            name=request.name,
            email=request.email,
            phone=request.phone,
            city=request.city
        )

        user_email = resend.Emails.send({
            "from": "NoRa EV <info@noraevtech.com>",
            "to": [request.email],
            "subject": "Thank You for Your Pre-Order - NoRa EV",
            "html": user_email_html
        })

        # Send notification email to admin
        admin_email_html = get_admin_notification_email(
            name=request.name,
            email=request.email,
            phone=request.phone,
            city=request.city
        )

        admin_email = resend.Emails.send({
            "from": "NoRa EV System <info@noraevtech.com>",
            "to": ["info@noraevtech.com"],
            "subject": f"New Pre-Order: {request.name} from {request.city}",
            "html": admin_email_html
        })

        return {
            "success": True,
            "message": "Pre-order submitted successfully",
            "data": {
                "name": request.name,
                "email": request.email,
                "city": request.city
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process pre-order: {str(e)}")


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "NoRa EV API"}
