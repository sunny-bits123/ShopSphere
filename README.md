# 🛒 ShopSphere —  E-Commerce Web Application

A full-stack e-commerce web application featuring secure JWT authentication, product management, shopping cart, wishlist, order management, Razorpay payment integration, and an admin dashboard.

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-02042B?style=for-the-badge&logo=razorpay&logoColor=3395FF)

---

## 🌐 Live Demo

> 🔗 **[shopsphere.vercel.app](https://shopsphere.vercel.app)** ← (add after deployment)

**Test Credentials:**
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@shopsphere.com | admin123 |
| User | Register a new account | - |

**Test Payment (Razorpay):**
- UPI ID: `success@razorpay`
- Card: `5267 3181 8797 5449` | Expiry: `02/26` | CVV: `123`

---

## ✨ Features

### 👤 User Features
- 🔐 JWT Authentication (Register / Login / Logout)
- 🔍 Product Search, Filter by Category, Price Range & Rating
- 🛍️ Product Detail Page with Image Gallery & Reviews
- ❤️ Wishlist (Add / Remove products)
- 🛒 Cart (Add / Update Quantity / Remove)
- 📍 Saved Addresses — auto-saved like Flipkart (no re-typing)
- 💳 Checkout with Razorpay (Cards / UPI / Wallets) & COD
- 📦 Order History with Status Timeline
- ❌ Cancel Order (Pending/Processing orders only)
- ⭐ Product Reviews & Ratings
- 👤 Profile Management with Address Book

### 🔧 Admin Features
- 📊 Dashboard with Revenue, Orders, Products & Users stats
- 📦 Product CRUD with Image URL management
- 🗂️ Category Management
- 🧾 Order Management with Status Updates
- 👥 User Management

### 🎨 UI/UX Features
- 🌙 Dark Navy + Electric Indigo theme
- 📱 Fully Responsive (Mobile, Tablet, Desktop)
- ⚡ Smooth animations and micro-interactions
- 🔝 Auto scroll to top on navigation
- 🍔 Mobile hamburger menu with full-screen overlay
- ✨ Shimmer skeleton loading effects

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Context API |
| Styling | Custom CSS (Dark theme, CSS Variables) |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose ODM |
| Auth | JWT + bcryptjs |
| Payments | Razorpay (Test + Live ready) |
| Security | Helmet, Rate Limiting, Mongo Sanitize |
| Dev Tools | Nodemon, Concurrently |

---

## 📁 Project Structure