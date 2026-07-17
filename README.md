# 🛒 ShopSphere —  E-Commerce Web Application

A full-stack e-commerce web application featuring secure JWT authentication, product management, shopping cart, wishlist, order management, Razorpay payment integration, and an admin dashboard.

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-02042B?style=for-the-badge&logo=razorpay&logoColor=3395FF)

---
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
```
shopsphere/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── cloudinary.js      # Cloudinary config
│   ├── controllers/
│   │   ├── authController.js  # Auth + Address management
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js            # JWT protect + authorize
│   │   ├── asyncHandler.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js            # User + Addresses + Wishlist
│   │   ├── Product.js         # Product + Reviews
│   │   ├── Order.js           # Order + Status History
│   │   └── Category.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── userRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── paymentRoutes.js
│   ├── utils/
│   │   ├── seeder.js          # Database seeder
│   │   └── errorResponse.js
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── common/        # PrivateRoute, AdminRoute, ScrollToTop
│       │   ├── layout/        # Navbar, Footer
│       │   └── product/       # ProductCard
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── CartContext.jsx
│       ├── pages/
│       │   ├── admin/         # Dashboard, Products, Orders, Users
│       │   ├── HomePage.jsx
│       │   ├── ProductsPage.jsx
│       │   ├── ProductDetailPage.jsx
│       │   ├── CartPage.jsx
│       │   ├── CheckoutPage.jsx
│       │   ├── OrdersPage.jsx
│       │   ├── OrderDetailPage.jsx
│       │   ├── ProfilePage.jsx
│       │   ├── WishlistPage.jsx
│       │   ├── AboutPage.jsx
│       │   ├── ContactPage.jsx
│       │   ├── PrivacyPolicyPage.jsx
│       │   ├── TermsPage.jsx
│       │   └── ReturnsPage.jsx
│       ├── utils/
│       │   └── api.js         # Axios instance + all API calls
│       ├── App.jsx
│       └── index.css          # Global styles
├── .env.example
├── .gitignore
└── package.json
```
---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)
- npm

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/shopsphere.git
cd shopsphere
```

### 2. Install Dependencies
```bash
# Install all dependencies (root + backend + frontend)
npm run install:all
```

### 3. Set Up Environment Variables
```bash
cp .env.example backend/.env
```

Open `backend/.env` and fill in:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/shopsphere
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
RAZORPAY_KEY_ID=your_razorpay_test_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 4. Seed the Database
```bash
npm run seed
```
This creates:
- ✅ Admin user (`admin@shopsphere.com` / `admin123`)
- ✅ 48 products across 4 categories
- ✅ 4 categories (Electronics, Clothing, Books, Home & Kitchen)

### 5. Run Development Server
```bash
npm run dev
```
- Frontend → http://localhost:3000
- Backend → http://localhost:5000

---

## 📡 API Reference

### Auth Routes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/auth/register | Register new user | Public |
| POST | /api/auth/login | Login user | Public |
| GET | /api/auth/me | Get logged-in user | Private |
| POST | /api/auth/logout | Logout | Private |
| PUT | /api/auth/me | Update profile | Private |
| PUT | /api/auth/password | Update password | Private |
| POST | /api/auth/address | Add address | Private |
| PUT | /api/auth/address/:id | Update address | Private |
| DELETE | /api/auth/address/:id | Delete address | Private |
| PUT | /api/auth/address/:id/default | Set default address | Private |

### Product Routes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/products | Get all products (filter/sort/search) | Public |
| GET | /api/products/:id | Get single product | Public |
| POST | /api/products | Create product | Admin |
| PUT | /api/products/:id | Update product | Admin |
| DELETE | /api/products/:id | Delete product | Admin |
| POST | /api/products/:id/reviews | Add review | Private |

### Order Routes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/orders | Place new order | Private |
| GET | /api/orders/me | Get my orders | Private |
| GET | /api/orders/:id | Get order details | Private |
| PUT | /api/orders/:id/pay | Mark as paid | Private |
| PUT | /api/orders/:id/status | Update status / Cancel | Private |
| GET | /api/orders | Get all orders | Admin |

### Payment Routes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/payment/create-order | Create Razorpay order | Private |
| POST | /api/payment/verify | Verify payment | Private |

---

## 🔑 Security Features

- ✅ JWT tokens with httpOnly cookies
- ✅ Password hashing with bcryptjs (12 rounds)
- ✅ Rate limiting (100 requests per 10 min)
- ✅ MongoDB query sanitization
- ✅ Security headers with Helmet
- ✅ Role-based authorization (user/admin)
- ✅ Razorpay signature verification

---

## 👨‍💻 Author

**Sunny Yadav**