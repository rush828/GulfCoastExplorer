# 🔐 Environment Variables - Simple Step-by-Step Guide

This guide will walk you through setting up ALL environment variables needed for production.

---

## 📋 QUICK START: What You Need

You need **11 environment variables total**. Here's the checklist:

- [ ] `ADMIN_SECRET` - Security key (generate)
- [ ] `NEXTAUTH_SECRET` - Auth key (generate)
- [ ] `ADMIN_PASSWORD` - Your admin password (create)
- [ ] `NEXTAUTH_URL` - Your website URL
- [ ] `NODE_ENV` - Set to "production"
- [ ] `GOOGLE_MAPS_API_KEY` - From Google Cloud
- [ ] `PAYPAL_CLIENT_ID` - From PayPal
- [ ] `PAYPAL_CLIENT_SECRET` - From PayPal
- [ ] `PAYPAL_ENVIRONMENT` - Set to "production"
- [ ] `SMTP_HOST` - Email server
- [ ] `SMTP_PORT` - Email port
- [ ] `SMTP_USER` - Email username
- [ ] `SMTP_PASS` - Email password

---

## 1️⃣ GENERATE SECURITY SECRETS (3 minutes)

### What: Random strings that secure your admin panel

### How:

**Option A: Use Terminal/Command Line**
```bash
# On Mac/Linux:
openssl rand -hex 32

# On Windows PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 255 }))
```

Run this command **TWICE** to get two different secrets.

**Option B: Use Online Generator**
1. Go to: https://generate-secret.vercel.app/32
2. Click "Generate" - copy the result
3. Click "Generate" again - copy this second result

### What to do with them:
```bash
ADMIN_SECRET=<paste first generated secret here>
NEXTAUTH_SECRET=<paste second generated secret here>
```

**Example:**
```bash
ADMIN_SECRET=f4a8b9c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0
NEXTAUTH_SECRET=1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2
```

### Also set your admin password:
```bash
ADMIN_PASSWORD=YourStrongPassword123!
```
Make it strong! Use letters, numbers, and symbols.

---

## 2️⃣ SITE CONFIGURATION (1 minute)

### Simple - just fill these in:

```bash
NEXTAUTH_URL=https://yourdomain.com
NODE_ENV=production
```

**Replace** `yourdomain.com` with your actual domain.  
**IMPORTANT:** No trailing slash at the end!

**Examples:**
- ✅ `https://gulfcoastexplorer.com`
- ✅ `https://www.gulfcoastdirectory.com`
- ❌ `https://gulfcoastexplorer.com/` (no trailing slash!)

---

## 3️⃣ GOOGLE MAPS API KEY (10 minutes)

### Why: Shows maps on business detail pages

### Step-by-step:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create or Select Project**
   - If first time: Click "Create Project"
   - Name it: "Gulf Coast Directory" (or anything you want)
   - Click "Create"

3. **Enable APIs**
   - In the left menu, click "APIs & Services" → "Library"
   - Search for and enable these:
     - ✅ "Maps JavaScript API" (REQUIRED)
     - ✅ "Places API" (optional)
     - ✅ "Geocoding API" (optional)

4. **Create API Key**
   - Click "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the key that appears

5. **IMPORTANT: Restrict Your Key (Security!)**
   - Click "Edit API key" (or the pencil icon)
   - Under "Application restrictions":
     - Select "HTTP referrers (web sites)"
     - Click "Add an item"
     - Enter: `yourdomain.com/*`
     - Enter: `www.yourdomain.com/*`
   - Under "API restrictions":
     - Select "Restrict key"
     - Check only: "Maps JavaScript API"
   - Click "Save"

6. **Set up Billing (Don't worry - it's free up to $200/month)**
   - In left menu: "Billing" → "Link a billing account"
   - Add a credit card (Google gives you $200 free credit every month)
   - You likely won't exceed the free tier

### Add to environment variables:
```bash
GOOGLE_MAPS_API_KEY=AIzaSyC_your_actual_key_here

# Optional - if you want admin data collection features:
GOOGLE_API_KEY=AIzaSyC_your_actual_key_here
```

You can use the same key for both or create separate keys.

---

## 4️⃣ PAYPAL PAYMENT PROCESSING (10 minutes)

### Why: For accepting business listing payments

### Step-by-step:

1. **Create PayPal Business Account**
   - If you don't have one: https://www.paypal.com/business
   - Sign up for a Business account (free)

2. **Go to Developer Dashboard**
   - Visit: https://developer.paypal.com/
   - Log in with your PayPal Business account

3. **Go to Apps**
   - Click "My Apps & Credentials"
   - Make sure you're on the "Live" tab (NOT Sandbox!)

4. **Create App**
   - Click "Create App"
   - Name it: "Gulf Coast Directory"
   - Click "Create App"

5. **Get Your Credentials**
   - You'll see "Client ID" - copy this
   - Click "Show" under "Secret" - copy this too

### Add to environment variables:
```bash
PAYPAL_CLIENT_ID=AeA1234567890_your_actual_client_id_here
PAYPAL_CLIENT_SECRET=EL-1234567890_your_actual_secret_here
PAYPAL_ENVIRONMENT=production
PAYPAL_WEBHOOK_ID=
```

Leave `PAYPAL_WEBHOOK_ID` blank for now. You'll set it up after deployment.

---

## 5️⃣ EMAIL CONFIGURATION (5 minutes)

### Why: For contact form and notifications

### EASIEST OPTION: Gmail

1. **Use Your Gmail Account**
   - You need a Gmail address

2. **Create App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - You may need to enable 2-factor authentication first
   - Select "Mail" and "Other (Custom name)"
   - Name it: "Gulf Coast Directory"
   - Click "Generate"
   - Copy the 16-character password (spaces don't matter)

3. **Add to Environment Variables**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
```

Replace `your-email@gmail.com` with your Gmail address.  
Replace the password with the app password you just generated.

### ALTERNATIVE: Other Email Services

**SendGrid (if you prefer):**
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

**Mailgun:**
```bash
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-smtp-username
SMTP_PASS=your-mailgun-smtp-password
```

---

## 6️⃣ OPTIONAL: CSRF Secret (2 minutes)

This adds extra security but isn't required.

### Generate it:
```bash
# Use the same method as step 1
openssl rand -hex 32
```

### Add to environment variables:
```bash
CSRF_SECRET=your_generated_secret_here
```

---

## ✅ COMPLETE EXAMPLE

Here's what your final environment variables should look like (with fake values):

```bash
# Security
ADMIN_SECRET=f4a8b9c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0
NEXTAUTH_SECRET=1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2
ADMIN_PASSWORD=MyStrongPassword123!
CSRF_SECRET=2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3

# Site
NEXTAUTH_URL=https://gulfcoastexplorer.com
NODE_ENV=production

# Google
GOOGLE_MAPS_API_KEY=AIzaSyC-1234567890abcdefghijklmnopqrstuvwxyz
GOOGLE_API_KEY=AIzaSyC-1234567890abcdefghijklmnopqrstuvwxyz

# PayPal
PAYPAL_CLIENT_ID=AeA1234567890abcdefghijklmnopqrstuvwxyz
PAYPAL_CLIENT_SECRET=EL-1234567890abcdefghijklmnopqrstuvwxyz
PAYPAL_ENVIRONMENT=production
PAYPAL_WEBHOOK_ID=

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
```

---

## 🚀 WHERE TO PUT THESE VARIABLES

### If deploying to Vercel:
1. Go to your project dashboard
2. Click "Settings" → "Environment Variables"
3. Add each variable one by one
4. Set "Environment" to "Production"
5. Click "Save"

### If deploying to Netlify:
1. Go to "Site settings" → "Build & deploy"
2. Scroll to "Environment variables"
3. Click "Edit variables"
4. Add each variable
5. Click "Save"

### If deploying to your own server:
Create a file called `.env.production` in your project root and paste all the variables there.

---

## 🧪 TESTING AFTER DEPLOYMENT

After you deploy with these variables:

1. **Test Admin Login**
   - Go to: `https://yourdomain.com/admin/login`
   - Enter your `ADMIN_PASSWORD`
   - Should log in successfully

2. **Test Maps**
   - Go to any business page
   - Map should load (not show error)

3. **Test Contact Form**
   - Go to: `https://yourdomain.com/contact`
   - Submit a test message
   - Check your email

4. **Test PayPal**
   - Try to create a business listing
   - PayPal buttons should appear
   - (Don't complete payment - just verify it loads)

---

## ❓ TROUBLESHOOTING

### "Admin login not working"
- Check `ADMIN_SECRET` is set correctly
- Check `ADMIN_PASSWORD` matches what you're typing
- Clear browser cookies and try again

### "Maps not loading"
- Check `GOOGLE_MAPS_API_KEY` is set
- Verify the key is restricted to your domain
- Check APIs are enabled in Google Cloud Console
- Check billing is set up (even though it's free)

### "Payment buttons not showing"
- Check `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` are set
- Make sure you're using LIVE credentials, not Sandbox
- Check `PAYPAL_ENVIRONMENT=production`

### "Contact form not sending emails"
- Check all SMTP_ variables are set
- If using Gmail, verify app password is correct
- Check 2-factor authentication is enabled on Gmail

---

## 🎉 THAT'S IT!

Once you have all these variables set up in your hosting provider, your site will be fully functional in production!

**Questions?** Check the values in `.env.production.template` for examples.

