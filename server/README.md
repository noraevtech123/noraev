# NoRa EV API Server

FastAPI backend for handling pre-orders and email notifications for NoRa EV website.

## Features

- Pre-order form submission endpoint
- Automated email confirmations to customers
- Admin notifications for new pre-orders
- Professional branded email templates
- CORS enabled for web integration
- Input validation and error handling

## Setup

### Prerequisites

- Python 3.8 or higher
- Resend API account

### Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Environment variables are already configured in `.env`:
```
RESEND_API_KEY=re_X2F7chAn_NNMgRTnrvwT87mbvX59e2b4U
```

### Running the Server

Development mode with auto-reload:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Production mode:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check
```
GET /
GET /health
```

Returns server status.

### Submit Pre-Order
```
POST /api/pre-order
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+92 300 1234567",
  "city": "Karachi"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Pre-order submitted successfully",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "city": "Karachi"
  }
}
```

**Error Response:**
```json
{
  "detail": "Validation error message"
}
```

## Email Templates

The server sends two types of emails:

1. **Customer Confirmation Email**
   - Sent to the customer's email address
   - Confirms pre-order submission
   - Displays submitted information
   - Includes NoRa EV branding (lime green #BFFF00, black, white)

2. **Admin Notification Email**
   - Sent to info@noraevtech.com
   - Notifies team of new pre-order
   - Contains customer contact information
   - Includes action reminder

## Integration with Frontend

Update the form submission in `/web/src/app/components/Hero.js` to call this API:

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = {
    name: e.target.name.value,
    email: e.target.email.value,
    phone: e.target.phone.value,
    city: e.target.city.value
  };

  try {
    const response = await fetch('http://localhost:8000/api/pre-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (data.success) {
      // Show success message
      alert('Thank you for your pre-order!');
      e.target.reset();
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Something went wrong. Please try again.');
  }
};
```

## File Structure

```
server/
├── main.py              # FastAPI application and routes
├── email_templates.py   # HTML email templates
├── requirements.txt     # Python dependencies
├── .env                # Environment variables
└── README.md           # This file
```

## Security Notes

- The `.env` file contains the Resend API key
- CORS is configured to allow requests from localhost:3000 and noraevtech.com
- Input validation is performed on all form fields
- Email addresses are validated using pydantic EmailStr

## Support

For issues or questions, contact the development team.
