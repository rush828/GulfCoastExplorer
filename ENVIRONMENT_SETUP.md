# 🔒 Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in your project root with these variables:

```bash
# Admin Authentication
ADMIN_PASSWORD=gulfcoast2025!
ADMIN_SECRET=gulf-coast-admin-2025

# Google APIs
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_ENVIRONMENT=sandbox

# Email Configuration (for contact form)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Security
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Production Settings
NODE_ENV=development
```

## Security Notes

1. **Never commit `.env.local` to version control**
2. **Change default passwords before production**
3. **Use strong, unique passwords for admin access**
4. **Generate secure random strings for secrets**

## Production Checklist

- [ ] Change ADMIN_PASSWORD to a strong password
- [ ] Generate new ADMIN_SECRET with openssl: `openssl rand -hex 32`
- [ ] Set NODE_ENV=production
- [ ] Use production PayPal environment
- [ ] Configure proper SMTP for emails
- [ ] Set up HTTPS with valid SSL certificates
