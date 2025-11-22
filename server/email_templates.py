def get_user_confirmation_email(name: str, email: str, phone: str, city: str) -> str:
    """
    Professional email template for user confirmation.
    Uses NoRa EV branding: Lime (#BFFF00), Black, White
    """
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NoRa EV Pre-Order Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', 'Helvetica', sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 0;">
                    <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                        <!-- Header with Lime accent -->
                        <tr>
                            <td style="background-color: #000000; padding: 0;">
                                <div style="background-color: #BFFF00; height: 4px;"></div>
                                <div style="padding: 30px 40px; text-align: center;">
                                    <h1 style="margin: 0; color: #BFFF00; font-size: 28px; font-weight: 600; letter-spacing: 1px;">
                                        NoRa EV
                                    </h1>
                                    <p style="margin: 8px 0 0 0; color: #ffffff; font-size: 12px; letter-spacing: 0.5px;">
                                        Nayi Soch, Naya Safar
                                    </p>
                                </div>
                            </td>
                        </tr>

                        <!-- Main Content -->
                        <tr>
                            <td style="padding: 40px 40px 30px 40px;">
                                <h2 style="margin: 0 0 20px 0; color: #000000; font-size: 24px; font-weight: 600;">
                                    Thank You for Your Pre-Order
                                </h2>
                                <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                    Dear {name},
                                </p>
                                <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                    Thank you for your interest in NoRa EV, Pakistan's first battery-swappable electric car. We have received your pre-order request and our team will be in touch with you shortly.
                                </p>

                                <!-- Details Box -->
                                <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0; background-color: #f8f8f8; border-left: 4px solid #BFFF00;">
                                    <tr>
                                        <td style="padding: 20px 25px;">
                                            <p style="margin: 0 0 12px 0; color: #000000; font-size: 14px; font-weight: 600;">
                                                Your Pre-Order Details:
                                            </p>
                                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                                <tr>
                                                    <td style="padding: 6px 0; color: #666666; font-size: 14px; width: 30%;">Name:</td>
                                                    <td style="padding: 6px 0; color: #000000; font-size: 14px; font-weight: 500;">{name}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 6px 0; color: #666666; font-size: 14px;">Email:</td>
                                                    <td style="padding: 6px 0; color: #000000; font-size: 14px; font-weight: 500;">{email}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 6px 0; color: #666666; font-size: 14px;">Phone:</td>
                                                    <td style="padding: 6px 0; color: #000000; font-size: 14px; font-weight: 500;">{phone}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 6px 0; color: #666666; font-size: 14px;">City:</td>
                                                    <td style="padding: 6px 0; color: #000000; font-size: 14px; font-weight: 500;">{city}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                                <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                    Our team will contact you within the next 24-48 hours to discuss the next steps and answer any questions you may have about NoRa EV.
                                </p>

                                <!-- Key Features -->
                                <div style="margin: 30px 0; padding: 20px; background-color: #000000; border-radius: 4px;">
                                    <h3 style="margin: 0 0 15px 0; color: #BFFF00; font-size: 18px; font-weight: 600;">
                                        Why Choose NoRa EV?
                                    </h3>
                                    <ul style="margin: 0; padding-left: 20px; color: #ffffff; font-size: 14px; line-height: 1.8;">
                                        <li>Battery-swappable technology for quick charging</li>
                                        <li>Affordable pricing: PKR 3.5M - 4.5M</li>
                                        <li>Zero fuel expenses</li>
                                        <li>Environmentally friendly</li>
                                        <li>Designed for Pakistani roads and lifestyle</li>
                                    </ul>
                                </div>

                                <p style="margin: 20px 0 0 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                    Best regards,<br>
                                    <strong>The NoRa EV Team</strong>
                                </p>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #000000; padding: 30px 40px; text-align: center;">
                                <p style="margin: 0 0 10px 0; color: #BFFF00; font-size: 16px; font-weight: 600;">
                                    NoRa EV
                                </p>
                                <p style="margin: 0 0 15px 0; color: #ffffff; font-size: 13px;">
                                    Be Part of Pakistan's Electric Future
                                </p>
                                <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.5;">
                                    This email was sent because you submitted a pre-order on noraevtech.com<br>
                                    © 2025 NoRa EV. All Rights Reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """


def get_admin_notification_email(name: str, email: str, phone: str, city: str) -> str:
    """
    Professional email template for admin notification.
    Uses NoRa EV branding: Lime (#BFFF00), Black, White
    """
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Pre-Order Notification</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', 'Helvetica', sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 0;">
                    <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                        <!-- Header -->
                        <tr>
                            <td style="background-color: #000000; padding: 0;">
                                <div style="background-color: #BFFF00; height: 4px;"></div>
                                <div style="padding: 30px 40px;">
                                    <h1 style="margin: 0; color: #BFFF00; font-size: 24px; font-weight: 600;">
                                        New Pre-Order Received
                                    </h1>
                                    <p style="margin: 8px 0 0 0; color: #ffffff; font-size: 14px;">
                                        A new customer has submitted a pre-order
                                    </p>
                                </div>
                            </td>
                        </tr>

                        <!-- Main Content -->
                        <tr>
                            <td style="padding: 40px;">
                                <!-- Customer Details Card -->
                                <div style="background-color: #f8f8f8; border-left: 4px solid #BFFF00; padding: 25px; margin-bottom: 25px;">
                                    <h2 style="margin: 0 0 20px 0; color: #000000; font-size: 18px; font-weight: 600;">
                                        Customer Information
                                    </h2>
                                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                        <tr>
                                            <td style="padding: 10px 0; color: #666666; font-size: 14px; width: 25%; vertical-align: top;">
                                                <strong>Name:</strong>
                                            </td>
                                            <td style="padding: 10px 0; color: #000000; font-size: 15px; font-weight: 500;">
                                                {name}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 10px 0; color: #666666; font-size: 14px; vertical-align: top;">
                                                <strong>Email:</strong>
                                            </td>
                                            <td style="padding: 10px 0; color: #000000; font-size: 15px; font-weight: 500;">
                                                <a href="mailto:{email}" style="color: #000000; text-decoration: none;">{email}</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 10px 0; color: #666666; font-size: 14px; vertical-align: top;">
                                                <strong>Phone:</strong>
                                            </td>
                                            <td style="padding: 10px 0; color: #000000; font-size: 15px; font-weight: 500;">
                                                <a href="tel:{phone}" style="color: #000000; text-decoration: none;">{phone}</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 10px 0; color: #666666; font-size: 14px; vertical-align: top;">
                                                <strong>City:</strong>
                                            </td>
                                            <td style="padding: 10px 0; color: #000000; font-size: 15px; font-weight: 500;">
                                                {city}
                                            </td>
                                        </tr>
                                    </table>
                                </div>

                                <!-- Action Required -->
                                <div style="background-color: #BFFF00; padding: 20px; border-radius: 4px; margin-bottom: 20px;">
                                    <h3 style="margin: 0 0 10px 0; color: #000000; font-size: 16px; font-weight: 600;">
                                        Action Required
                                    </h3>
                                    <p style="margin: 0; color: #000000; font-size: 14px; line-height: 1.6;">
                                        Please follow up with this customer within 24-48 hours to discuss their pre-order and next steps.
                                    </p>
                                </div>

                                <p style="margin: 0; color: #666666; font-size: 13px; line-height: 1.5;">
                                    This is an automated notification from the NoRa EV pre-order system.
                                </p>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #000000; padding: 25px 40px; text-align: center;">
                                <p style="margin: 0; color: #999999; font-size: 12px;">
                                    NoRa EV Admin System<br>
                                    © 2025 NoRa EV. All Rights Reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """


def get_support_user_email(name: str, phone: str, query: str) -> str:
    """
    Professional email template for customer support query confirmation (sent to admin as record).
    Uses NoRa EV branding: Lime (#BFFF00), Black, White
    """
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Customer Support Query Received</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', 'Helvetica', sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 0;">
                    <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                        <!-- Header -->
                        <tr>
                            <td style="background-color: #000000; padding: 0;">
                                <div style="background-color: #BFFF00; height: 4px;"></div>
                                <div style="padding: 30px 40px; text-align: center;">
                                    <h1 style="margin: 0; color: #BFFF00; font-size: 28px; font-weight: 600; letter-spacing: 1px;">
                                        NoRa EV
                                    </h1>
                                    <p style="margin: 8px 0 0 0; color: #ffffff; font-size: 12px; letter-spacing: 0.5px;">
                                        Customer Support
                                    </p>
                                </div>
                            </td>
                        </tr>

                        <!-- Main Content -->
                        <tr>
                            <td style="padding: 40px 40px 30px 40px;">
                                <h2 style="margin: 0 0 20px 0; color: #000000; font-size: 24px; font-weight: 600;">
                                    Thank You for Contacting Us
                                </h2>
                                <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                    Dear {name},
                                </p>
                                <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                    We have received your query and our customer support team will contact you shortly at {phone}.
                                </p>

                                <!-- Query Box -->
                                <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0; background-color: #f8f8f8; border-left: 4px solid #BFFF00;">
                                    <tr>
                                        <td style="padding: 20px 25px;">
                                            <p style="margin: 0 0 12px 0; color: #000000; font-size: 14px; font-weight: 600;">
                                                Your Query:
                                            </p>
                                            <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.6;">
                                                {query}
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                                <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                    Our team will reach out to you within the next few hours to assist you with your inquiry about NoRa EV.
                                </p>

                                <p style="margin: 20px 0 0 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                    Best regards,<br>
                                    <strong>NoRa EV Customer Support Team</strong>
                                </p>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #000000; padding: 30px 40px; text-align: center;">
                                <p style="margin: 0 0 10px 0; color: #BFFF00; font-size: 16px; font-weight: 600;">
                                    NoRa EV
                                </p>
                                <p style="margin: 0 0 15px 0; color: #ffffff; font-size: 13px;">
                                    Be Part of Pakistan's Electric Future
                                </p>
                                <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.5;">
                                    © 2025 NoRa EV. All Rights Reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """


def get_support_admin_email(name: str, phone: str, query: str) -> str:
    """
    Professional email template for admin notification of customer support query.
    Uses NoRa EV branding: Lime (#BFFF00), Black, White
    """
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Customer Support Query</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', 'Helvetica', sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 0;">
                    <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                        <!-- Header -->
                        <tr>
                            <td style="background-color: #000000; padding: 0;">
                                <div style="background-color: #BFFF00; height: 4px;"></div>
                                <div style="padding: 30px 40px;">
                                    <h1 style="margin: 0; color: #BFFF00; font-size: 24px; font-weight: 600;">
                                        New Customer Support Query
                                    </h1>
                                    <p style="margin: 8px 0 0 0; color: #ffffff; font-size: 14px;">
                                        A customer has submitted a support query via voice AI
                                    </p>
                                </div>
                            </td>
                        </tr>

                        <!-- Main Content -->
                        <tr>
                            <td style="padding: 40px;">
                                <!-- Customer Details Card -->
                                <div style="background-color: #f8f8f8; border-left: 4px solid #BFFF00; padding: 25px; margin-bottom: 25px;">
                                    <h2 style="margin: 0 0 20px 0; color: #000000; font-size: 18px; font-weight: 600;">
                                        Customer Information
                                    </h2>
                                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                        <tr>
                                            <td style="padding: 10px 0; color: #666666; font-size: 14px; width: 25%; vertical-align: top;">
                                                <strong>Name:</strong>
                                            </td>
                                            <td style="padding: 10px 0; color: #000000; font-size: 15px; font-weight: 500;">
                                                {name}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 10px 0; color: #666666; font-size: 14px; vertical-align: top;">
                                                <strong>Phone:</strong>
                                            </td>
                                            <td style="padding: 10px 0; color: #000000; font-size: 15px; font-weight: 500;">
                                                <a href="tel:{phone}" style="color: #000000; text-decoration: none;">{phone}</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 10px 0; color: #666666; font-size: 14px; vertical-align: top;">
                                                <strong>Query:</strong>
                                            </td>
                                            <td style="padding: 10px 0; color: #000000; font-size: 15px; line-height: 1.6;">
                                                {query}
                                            </td>
                                        </tr>
                                    </table>
                                </div>

                                <!-- Action Required -->
                                <div style="background-color: #BFFF00; padding: 20px; border-radius: 4px; margin-bottom: 20px;">
                                    <h3 style="margin: 0 0 10px 0; color: #000000; font-size: 16px; font-weight: 600;">
                                        Action Required
                                    </h3>
                                    <p style="margin: 0; color: #000000; font-size: 14px; line-height: 1.6;">
                                        Please contact this customer as soon as possible to address their query. Customer used the voice AI support system.
                                    </p>
                                </div>

                                <p style="margin: 0; color: #666666; font-size: 13px; line-height: 1.5;">
                                    This is an automated notification from the NoRa EV customer support system.
                                </p>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #000000; padding: 25px 40px; text-align: center;">
                                <p style="margin: 0; color: #999999; font-size: 12px;">
                                    NoRa EV Admin System<br>
                                    © 2025 NoRa EV. All Rights Reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """
