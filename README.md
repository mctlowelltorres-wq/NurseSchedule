# NurseShift Pro - Local Setup Guide

This guide will help you run the **Medical Center Taguig Scheduling System** on your local machine.

## Prerequisites

- **Node.js**: Version 18 or higher.
- **npm**: Usually comes with Node.js.

## 1. Export the Code

1. In the AI Studio editor, go to the **Settings** menu (gear icon).
2. Select **Export** and choose **Download as ZIP** or **Export to GitHub**.
3. Extract the ZIP file to a folder on your computer.

## 2. Install Dependencies

Open your terminal (Command Prompt, PowerShell, or Terminal), navigate to the project folder, and run:

```bash
npm install
```

## 3. Firebase Configuration

The project already includes `firebase-applet-config.json` which contains the necessary API keys to connect to your cloud database.

### **CRITICAL STEP: Authorize Localhost**
To allow "Sign in with Google" to work on your computer, you must add `localhost` to your Firebase project's authorized domains:

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project.
3. Go to **Authentication** > **Settings** > **Authorized Domains**.
4. Click **Add Domain** and enter `localhost`.

## 4. Run the Application

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000` (or the port shown in your terminal).

## 5. Sharing with Staff (Other Devices)

To allow other staff members (Nurses/Head Nurses) to use the system on their own devices:

### Option A: Use the Shared URL (Easiest)
1. In AI Studio, click the **Share** button at the top right.
2. Copy the **Shared App URL**.
3. Send this link to your staff via email or messaging app.
4. They can open this link on any smartphone, tablet, or computer.

### Option B: "Install" as an App (Mobile/Desktop)
Users can add the system to their home screen so it feels like a real app:
- **On iPhone (Safari)**: Open the URL -> Tap the **Share** icon (square with arrow) -> Tap **"Add to Home Screen"**.
- **On Android (Chrome)**: Open the URL -> Tap the **three dots** (menu) -> Tap **"Install App"** or **"Add to Home Screen"**.

## 6. Permanent Deployment

If you want to host the system permanently on your own server:
1. Run `npm run build` to generate the `dist` folder.
2. Upload the contents of the `dist` folder to any web host (Firebase Hosting, Vercel, Netlify, or your own server).
3. Ensure your custom domain is added to the **Authorized Domains** in the Firebase Console (see Section 3).

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Creates a production-ready build in the `dist` folder.
- `npm run lint`: Checks the code for errors.

---
*Created for Medical Center Taguig Scheduling System*
