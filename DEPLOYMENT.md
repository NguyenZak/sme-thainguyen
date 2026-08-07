# SME Vietnam 2026 - Deployment Guide

This guide covers deploying the landing page to **Vercel** and configuring the **Google Apps Script** integration for Google Sheets and automated confirmation emails.

---

## 1. Google Sheets & Google Apps Script Setup

### Step 1: Create a Google Sheet
1. Open [Google Sheets](https://sheets.new) and create a new spreadsheet.
2. Title it: `SME Vietnam 2026 - Registrations`.
3. In **Sheet 1**, set the headers in Row 1:
   - Column A: `Timestamp`
   - Column B: `Registration Type`
   - Column C: `Full Name`
   - Column D: `Company`
   - Column E: `Position`
   - Column F: `Phone`
   - Column G: `Email`
   - Column H: `Province`
   - Column I: `Sector`
   - Column J: `Networking Needs`
   - Column K: `Notes`
   - Column L: `Status`

### Step 2: Add Apps Script Code
1. Click on **Extensions** -> **Apps Script** in the menu bar.
2. Clear any default code in `Code.gs`.
3. Copy the entire contents from `google-apps-script.js` in this repository and paste it into the script editor.
4. Click **Save** (Ctrl+S or Cmd+S).

### Step 3: Deploy as Web App
1. Click **Deploy** -> **New Deployment**.
2. Select type: **Web App** (click the gear icon next to Select type).
3. Set fields:
   - **Description**: `SME 2026 Registration Endpoint v1`
   - **Execute as**: `Me (your-email@gmail.com)`
   - **Who has access**: `Anyone`
4. Click **Deploy**.
5. Grant permissions if prompted by Google.
6. Copy the **Web App URL** (starts with `https://script.google.com/macros/s/.../exec`).

---

## 2. Environment Variables Setup

Create a `.env.local` file in your local workspace or add environment variables in your Vercel project settings:

```env
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYED_SCRIPT_ID/exec
```

---

## 3. Deploy to Vercel

### Method A: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Method B: Git Integration (GitHub / GitLab / Bitbucket)
1. Push your repository to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Import the project repository `sme-vietnam-2026`.
4. In **Environment Variables**, add:
   - Key: `NEXT_PUBLIC_GOOGLE_SCRIPT_URL`
   - Value: `(Your Google Apps Script Web App URL)`
5. Click **Deploy**.

---

## 4. Verification & Testing

1. Open your deployed Vercel site URL.
2. Navigate to the `#register` section.
3. Submit a test registration form.
4. Verify:
   - A success toast and digital ticket modal appear with confetti.
   - The test row appears instantly in your Google Sheet.
   - A styled confirmation email with a check-in QR code arrives in the test email inbox.
