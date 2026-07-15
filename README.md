# 🛒 ShopSphere — MERN E-Commerce Platform

A full-featured e-commerce application built with MongoDB, Express.js, React, and Node.js.

![ShopSphere](https://img.shields.io/badge/Stack-MERN-61DAFB?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ Features

### User Side
- 🔐 JWT Authentication (Register / Login / Logout)
- 🔍 Product Search, Filter & Sort
- 🛍️ Product Detail Pages with Image Gallery
- 🛒 Cart (Add / Update / Remove)
- 💳 Checkout with Address & Payment (Razorpay / Stripe ready)
- 📦 Order History & Order Tracking
- ⭐ Product Reviews & Ratings
- 👤 Profile Management

### Admin Panel
- 📊 Dashboard with Sales Analytics
- 📦 Product CRUD (with image upload via Cloudinary)
- 🗂️ Category Management
- 🧾 Order Management & Status Updates
- 👥 User Management

## 🏗️ Tech Stack

| Layer     | Technology                              |
|-----------|----------------------------------------|
| Frontend  | React 18, React Router v6, Context API |
| Styling   | Tailwind CSS + custom CSS               |
| Backend   | Node.js, Express.js                    |
| Database  | MongoDB + Mongoose ODM                 |
| Auth      | JWT + bcryptjs                         |
| Upload    | Multer + Cloudinary                    |
| Payments  | Razorpay (pluggable)                   |

## 📁 Project Structure

```
ecommerce-mern/
├── backend/
│   ├── config/          # DB connection, Cloudinary config
│   ├── controllers/     # Route controllers (auth, product, order, user)
│   ├── middleware/      # Auth guard, error handler, async wrapper
│   ├── models/          # Mongoose schemas (User, Product, Order, Category)
│   └── routes/          # Express routers
├── frontend/
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── pages/       # Route-level page components
│       ├── context/     # Cart, Auth, Toast context providers
│       ├── hooks/       # Custom React hooks
│       └── utils/       # API helpers, formatters
├── .env.example
└── package.json         # Root scripts (concurrently)
```

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repo
```bash
git clone https://github.com/YOUR_USERNAME/ecommerce-mern.git
cd ecommerce-mern
```

### 2. Install Dependencies
```bash
# Install root + backend + frontend deps
npm run install:all
```

### 3. Set Up Environment Variables
```bash
cp .env.example backend/.env
# Fill in your MongoDB URI, JWT secret, Cloudinary keys, etc.
```

### 4. Seed the Database (optional)
```bash
npm run seed
```

### 5. Run Development Servers
```bash
npm run dev   # Starts backend (5000) and frontend (3000) concurrently
```

### 6. Build for Production
```bash
npm run build
npm start
```

## 🔑 Environment Variables

```env
# backend/.env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/shopsphere
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

## 📡 API Reference

### Auth
| Method | Endpoint            | Description          | Access  |
|--------|---------------------|----------------------|---------|
| POST   | /api/auth/register  | Register new user    | Public  |
| POST   | /api/auth/login     | Login user           | Public  |
| GET    | /api/auth/me        | Get logged-in user   | Private |
| POST   | /api/auth/logout    | Logout               | Private |

### Products
| Method | Endpoint                    | Description           | Access  |
|--------|-----------------------------|-----------------------|---------|
| GET    | /api/products               | Get all products      | Public  |
| GET    | /api/products/:id           | Get single product    | Public  |
| POST   | /api/products               | Create product        | Admin   |
| PUT    | /api/products/:id           | Update product        | Admin   |
| DELETE | /api/products/:id           | Delete product        | Admin   |
| POST   | /api/products/:id/reviews   | Add review            | Private |

### Cart & Orders
| Method | Endpoint            | Description          | Access  |
|--------|---------------------|----------------------|---------|
| GET    | /api/orders/me      | Get my orders        | Private |
| POST   | /api/orders         | Place new order      | Private |
| GET    | /api/orders/:id     | Get order details    | Private |
| PUT    | /api/orders/:id     | Update order status  | Admin   |

## 🧪 Testing

```bash
# Backend unit tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## 🤝 Contributing
Pull requests are welcome! Please open an issue first to discuss changes.

## 📄 License
MIT © 2024 — Built with ❤️ using MERN Stack
