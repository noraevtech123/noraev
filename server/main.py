from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, validator
import resend
import os
import logging
from dotenv import load_dotenv
from email_templates import (
    get_user_confirmation_email,
    get_admin_notification_email,
    get_support_user_email,
    get_support_admin_email
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI(title="NoRa EV API", version="1.0.0")

# CORS configuration
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,https://noraevtech.com").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins],
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


class CustomerSupportRequest(BaseModel):
    name: str
    phone: str
    query: str

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

    @validator('query')
    def validate_query(cls, v):
        if not v or len(v.strip()) < 5:
            raise ValueError('query must be at least 5 characters')
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


@app.post("/api/customer-support")
async def submit_customer_support(request: CustomerSupportRequest):
    logger.info(f"Received customer support request from {request.name}, phone: {request.phone}")

    try:
        # Send confirmation email to user
        logger.info("Generating user confirmation email...")
        user_email_html = get_support_user_email(
            name=request.name,
            phone=request.phone,
            query=request.query
        )

        logger.info(f"Sending user confirmation email to info@noraevtech.com...")
        user_email = resend.Emails.send({
            "from": "NoRa EV Support <info@noraevtech.com>",
            "to": ["info@noraevtech.com"],  # Will be sent to admin, user doesn't provide email
            "subject": f"Customer Support Query from {request.name}",
            "html": user_email_html,
            "reply_to": "info@noraevtech.com"
        })
        logger.info(f"User email sent successfully. Email ID: {user_email.get('id', 'N/A')}")

        # Send notification email to admin
        logger.info("Generating admin notification email...")
        admin_email_html = get_support_admin_email(
            name=request.name,
            phone=request.phone,
            query=request.query
        )

        logger.info(f"Sending admin notification email to info@noraevtech.com...")
        admin_email = resend.Emails.send({
            "from": "NoRa EV System <info@noraevtech.com>",
            "to": ["info@noraevtech.com"],
            "subject": f"New Customer Support Query: {request.name}",
            "html": admin_email_html
        })
        logger.info(f"Admin email sent successfully. Email ID: {admin_email.get('id', 'N/A')}")

        logger.info(f"Customer support request completed successfully for {request.name}")
        return {
            "success": True,
            "message": "Customer support query submitted successfully",
            "data": {
                "name": request.name,
                "phone": request.phone
            }
        }

    except Exception as e:
        logger.error(f"Failed to process customer support query: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to process customer support query: {str(e)}")


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "NoRa EV API"}
