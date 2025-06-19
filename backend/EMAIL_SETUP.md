# Email Setup Guide for ShikshaHub

This guide will help you set up email functionality for sending welcome emails to newly registered users.

## Prerequisites

1. A Gmail account (or other email service)
2. App password for your email account

## Setup Instructions

### 1. Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to your Google Account settings
   - Navigate to Security
   - Under "Signing in to Google", select "App passwords"
   - Generate a new app password for "Mail"
   - Copy the generated password

### 2. Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/shikshahub

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Email Configuration (for Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. Alternative Email Services

If you prefer to use other email services, modify the `createTransporter` function in `utils/emailService.js`:

#### Outlook/Hotmail
```javascript
const transporter = nodemailer.createTransporter({
  service: 'outlook',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

#### Yahoo
```javascript
const transporter = nodemailer.createTransporter({
  service: 'yahoo',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

#### Custom SMTP
```javascript
const transporter = nodemailer.createTransporter({
  host: 'your-smtp-host.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

## Testing the Email Functionality

1. Start your backend server
2. Register a new user through your application
3. Check the console logs for email sending status
4. Check the user's email inbox for the welcome email

## Troubleshooting

### Common Issues

1. **Authentication Failed**: Make sure you're using an app password, not your regular Gmail password
2. **Less secure app access**: Enable 2-factor authentication and use app passwords
3. **Email not sending**: Check your environment variables are correctly set
4. **Email going to spam**: Add your email to the user's contacts or whitelist

### Debug Mode

To enable debug mode for email sending, add this to your `.env` file:
```env
EMAIL_DEBUG=true
```

## Email Template Customization

The welcome email template is located in `utils/emailService.js`. You can customize:
- Email subject
- HTML content and styling
- Features list
- Call-to-action button
- Footer information

## Security Notes

- Never commit your `.env` file to version control
- Use app passwords instead of regular passwords
- Consider using email service providers like SendGrid or Mailgun for production
- Implement rate limiting for email sending to prevent abuse 