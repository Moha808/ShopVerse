# ShopVerse — Deployment Guide

Follow these steps to deploy your ShopVerse e-commerce platform to production using **Vercel** (Frontend) and **Firebase** (Backend).

## 1. Firebase Setup

### Create a Project

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Create a new project named `shopverse-prod` (or your preferred name).
3.  Register a **Web App** in the project settings.
4.  Copy the Firebase config object.

### Enable Services

1.  **Authentication**: Enable **Email/Password** and **Google** providers.
2.  **Firestore**: Create a database in **Production Mode**.
3.  **Storage**: Enable Cloud Storage.

### Deploy Security Rules

Use the provided `firestore.rules` and `storage.rules` files:

1.  Install Firebase CLI: `npm install -g firebase-tools`
2.  Login: `firebase login`
3.  Initialize: `firebase init` (Select Firestore and Storage)
4.  Deploy: `firebase deploy --only firestore,storage`

## 2. Paystack Setup

1.  Create an account at [Paystack](https://paystack.com/).
2.  Go to **Settings > API Keys**.
3.  Copy your **Public Key** (use Test Key for development, Live Key for production).

## 3. Vercel Deployment

### Prepare the Repository

Ensure your code is pushed to a GitHub/GitLab/Bitbucket repository.

### Import Project

1.  Login to [Vercel](https://vercel.com/dashboard).
2.  Click **Add New > Project**.
3.  Import your ShopVerse repository.

### Configure Environment Variables

In the Vercel dashboard, add the following variables:

| Variable                            | Value                             | Description |
| ----------------------------------- | --------------------------------- | ----------- |
| `VITE_FIREBASE_API_KEY`             | Your Key                          | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN`         | your-project.firebaseapp.com      | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID`          | your-project-id                   | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET`      | your-project.appspot.com          | Firebase storage bucket URL |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | your-sender-id                    | Firebase sender ID |
| `VITE_FIREBASE_APP_ID`              | your-app-id                       | Firebase web application ID |
| `VITE_PAYSTACK_PUBLIC_KEY`          | pk_live_your_key (for production) | Paystack production public key |
| `VITE_CLOUDINARY_CLOUD_NAME`        | your-cloudinary-cloud-name        | Cloudinary cloud name (for admin uploads) |
| `VITE_CLOUDINARY_UPLOAD_PRESET`     | your-cloudinary-preset            | Cloudinary unsigned upload preset name |

### Build Settings

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Deploy

Click **Deploy**. Vercel will build and host your application.

## 4. Post-Deployment Checks

1.  **Admin Role**: After your first login, go to Firestore and manually set your user's `role` to `"admin"`.
2.  **Domain Verification**: If using a custom domain, add it in Vercel settings and update your authorized domains in Firebase Auth.
3.  **SEO Check**: Verify that your site title and meta descriptions appear correctly in search results.

Congratulations! Your ShopVerse store is now live! 🚀
