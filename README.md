# ShopVerse — Premium E-Commerce Platform

ShopVerse is a modern, high-performance e-commerce platform built with React, Vite, Tailwind CSS 4, and Firebase. It features a stunning UI, full shopping workflow, user dashboard, and a comprehensive admin panel.

## 🚀 Features

- **Modern UI/UX:** Responsive, fast, and mobile-first design using Tailwind CSS 4.
- **Full Shopping Experience:** Category filtering, product search, sorting, and detailed product pages.
- **Cart & Wishlist:** Real-time persistence with LocalStorage and Firestore sync.
- **Secure Authentication:** Firebase Auth (Email/Password & Google Sign-In).
- **Payments:** Integrated with **Paystack** for secure transactions (special focus on African markets).
- **User Dashboard:** Order tracking, profile management, and address book.
- **Admin Panel:** Full CRUD for products, orders, users, and promotional coupons.
- **Analytics:** Sales overview and revenue tracking for administrators.

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, React Router 6, React Icons, React Hot Toast.
- **Styling:** Tailwind CSS 4 (with CSS variables and custom theme).
- **Backend:** Firebase (Firestore, Auth, Storage).
- **Payments:** Paystack.

## 📦 Getting Started

### 1. Prerequisites

- Node.js (v18+)
- npm or yarn

### 2. Installation

```bash
npm install
```

### 3. Environment Setup

Rename `.env.example` to `.env` and fill in your Firebase and Paystack credentials:

```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_key
```

### 4. Admin Access

To access the Admin Panel (`/admin`):

1.  Register a new account on the platform.
2.  Open your Firebase Firestore Console.
3.  Find your user document in the `users` collection.
4.  Change the `role` field from `"customer"` to `"admin"`.

### 5. Running the App

```bash
npm run dev
```

### 6. Building for Production

```bash
npm run build
```

## 📝 Important Notes

- **Demo Mode:** If Firebase or Paystack keys are missing, the app will automatically fall back to using high-quality demo data and simulated payments, allowing you to explore the UI immediately.
- **Product Images:** Use high-quality Unsplash URLs (as seen in `seedData.js`) for the best visual experience.
- **Security:** Firestore rules should be configured to protect user data and restrict admin paths.

## 📂 Project Structure

- `src/components`: Reusable UI components.
- `src/contexts`: State management (Auth, Cart, Wishlist).
- `src/services`: Backend integration (Firebase CRUD).
- `src/pages`: Main application views.
- `src/utils`: Helpers, constants, and seed data.

Enjoy building with ShopVerse! 🛒✨
