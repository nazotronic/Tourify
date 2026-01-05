# 🌍 Tourify - Tour Booking Web System

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white)

**Tourify** is a modern, web-based platform for browsing and booking travel tours. It provides a seamless experience for tourists to discover their next adventure and a powerful dashboard for administrators to manage bookings and content.

The project is built as a Single Page Application (SPA) using **React** and powered by **Firebase** (Auth & Firestore) for a serverless, real-time backend.

---

## ✨ Features

### 👤 For Users (Tourists)
*   **Explore Tours:** Browse a rich catalog of tours with filters by country and price.
*   **Booking System:** Easy 3-step booking process with instant feedback.
*   **Personal Dashboard:** Track booking statuses (`Pending`, `Confirmed`, `Cancelled`) in real-time.
*   **Favorites:** Save tours to your wishlist.
*   **Profile Management:** Update personal details and avatar.
*   **Online Support:** Send messages directly to the administration.

### 👑 For Administrators
*   **Dashboard:** Overview of new bookings and active users.
*   **Booking Management:** Approve or Reject incoming booking requests.
*   **Tour Management (CRUD):** Create, Read, Update, and Delete tours in the catalog.
*   **Support Center:** Read and mark user inquiries as read.
*   **User Management:** View registered users.

---

## 🛠️ Technology Stack

*   **Frontend:** React.js 18
*   **Build Tool:** Vite (Super fast build times)
*   **Routing:** React Router v6
*   **Backend / Database:** Firebase (Cloud Firestore)
*   **Authentication:** Firebase Authentication (Email/Password)
*   **Styling:** Custom CSS with Glassmorphism design system

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v16+)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/nazotronic/Tourify.git
    cd Tourify
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Firebase**
    *   The project expects a `src/config/firebase.js` file with your Firebase configuration keys.
    *   *Note: This project is already configured with a public Firebase instance for demonstration purposes.*

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  **Open in browser**
    Visit `http://localhost:5174` (or the port shown in your terminal).

---

## 📂 Project Structure

```
src/
├── components/      # Reusable UI components (Avatar, Layout, Modal)
├── config/          # Firebase configuration & API abstraction layer
├── context/         # React Contexts (AuthContext, BookingContext)
├── pages/           # Page components (Home, Tours, Dashboard, Admin...)
├── styles/          # Global styles and variables
└── main.jsx         # Application entry point
```

---

## 🔑 key Roles & Credentials

**Admin Access:**
*   **URL:** `/admin`
*   **Email:** `admin@tourify.com`
*   **Password:** `admin123`

**User Access:**
*   Any registered user via `/login`.

---

## 🛡️ License

This project was developed as a Coursework Project.
All rights reserved © 2026.
