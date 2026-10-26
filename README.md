# 🛒 ShopSphere – Full-Stack E-Commerce Management System

> **An enterprise-grade, full-stack e-commerce platform built with Java 22, Spring Boot 3, React 18, MySQL 8, Spring Security 6 (stateless JWT), and Razorpay payments.**

---

## 📌 1. Project Overview

**ShopSphere** is a complete, production-ready e-commerce management system tailored for technical internship presentations and software engineering interviews. It models both the end-to-end customer shopping experience and a comprehensive administrative portal with live sales analytics, automated inventory tracking, and order fulfillment workflows.

### 🌟 Live Demo Credentials
- **Customer Demo**:
  - Email: `customer@shopsphere.com`
  - Password: `Customer@123`
- **Administrator Demo**:
  - Email: `admin@shopsphere.com`
  - Password: `Admin@123`
*(Both credentials can be auto-filled with 1-click helper buttons on the login page!)*

---

## 🛠️ 2. Technology Stack

| Layer | Technologies & Tools |
| :--- | :--- |
| **Frontend** | React 18, Vite, Redux Toolkit, React Router v6, Axios, Lucide React, Modern CSS Design System |
| **Backend** | Java 22, Spring Boot 3.3.4, Spring MVC, Spring Data JPA, Hibernate ORM, Spring Security 6, JJWT 0.12.6, Maven 3.9 |
| **Database** | MySQL 8.0 (3NF Normalized, Foreign Key Constraints, Cascades, Indexes, Transactions) |
| **Payments** | Razorpay (HMAC-SHA256 Cryptographic Signature Verification with Sandbox Demo Mode) |
| **Notifications**| Spring Mail / JavaMailSender with Simulated Receipt Logging Fallback |

---

## 📐 3. System Architecture

```text
                    ┌─────────────────────────┐
                    │      WEB BROWSER        │
                    │   React 18 + Redux      │
                    └────────────┬────────────┘
                                 │
                         REST APIs / JSON
                         (Bearer JWT Header)
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   SPRING BOOT 3 BACKEND │
                    │   Port: 8080            │
                    │                         │
                    │ ┌─────────────────────┐ │
                    │ │ Spring Security 6   │ │
                    │ │ JWT Auth Filter     │ │
                    │ └──────────┬──────────┘ │
                    │            ▼            │
                    │ ┌─────────────────────┐ │
                    │ │ Controller Layer    │ │
                    │ └──────────┬──────────┘ │
                    │            ▼            │
                    │ ┌─────────────────────┐ │
                    │ │ Service Layer       │ │
                    │ │ (Business Rules)    │ │
                    │ └──────────┬──────────┘ │
                    │            ▼            │
                    │ ┌─────────────────────┐ │
                    │ │ JPA Repository Layer│ │
                    │ └──────────┬──────────┘ │
                    └────────────┼────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
        ┌───────────┐      ┌───────────┐      ┌───────────┐
        │  MySQL 8  │      │ Razorpay  │      │  Spring   │
        │ Database  │      │ HMAC Sign │      │   Mail    │
        │ localhost │      │ Verify    │      │  Service  │
        └───────────┘      └───────────┘      └───────────┘
```

---

## 🗄️ 4. Database Relational Model (ER Schema)

```text
USERS (id, first_name, last_name, email, password, phone, status)
  ├── 1:N ── ADDRESSES (id, user_id, street, city, state, postal_code, is_default)
  ├── 1:1 ── CARTS (id, user_id) ── 1:N ── CART_ITEMS (id, cart_id, product_id, quantity)
  ├── 1:1 ── WISHLISTS (id, user_id) ── 1:N ── WISHLIST_ITEMS (id, wishlist_id, product_id)
  ├── 1:N ── ORDERS (id, order_number, user_id, address_id, total_amount, order_status)
  │            ├── 1:N ── ORDER_ITEMS (id, order_id, product_id, quantity, unit_price, subtotal)
  │            └── 1:1 ── PAYMENTS (id, order_id, payment_method, razorpay_order_id, status)
  └── 1:N ── REVIEWS (id, user_id, product_id, rating, comment, is_verified_purchase)

CATEGORIES (id, name, slug) ── 1:N ── PRODUCTS (id, name, slug, price, discount_percent, sku)
BRANDS (id, name, slug) ── 1:N ──────┘      ├── 1:N ── PRODUCT_IMAGES (id, product_id, image_url)
                                            └── 1:1 ── INVENTORY (id, product_id, quantity, reorder_level)

COUPONS (id, code, discount_type, discount_value, min_order_amount, expiry_date)
  └── 1:N ── COUPON_USAGE (id, coupon_id, user_id, order_id)
```

---

## 💡 5. Key Business Logic & Interview Discussion Points

### 1. Verified Purchase Reviews
- **Rule**: A customer cannot review a product simply because they logged in.
- **Implementation**: `ReviewService.addOrUpdateReview()` queries:
  ```java
  orderRepository.hasPurchasedAndDeliveredProduct(userId, productId, OrderStatus.DELIVERED);
  ```
  If false, it returns `400 Bad Request` with an explicit reason. Upon submission, average rating and review counts are recalculated in real time.

### 2. Atomic Inventory Deduction & Low-Stock Alerts
- **Rule**: When an order is placed, stock must decrement atomically within a `@Transactional` boundary to prevent overselling.
- **Cancellation**: If an order is cancelled prior to shipment, `inventoryService.restoreStock()` returns the items back to physical availability.
- **Alerting**: Products whose stock falls below `reorder_level` automatically populate the low-stock dashboard alert queue.

### 3. Razorpay Cryptographic Verification
- **Rule**: Never trust client-side payment confirmation without backend validation.
- **Implementation**: The backend validates the payment by computing an HMAC-SHA256 signature using the secret key over `razorpay_order_id|razorpay_payment_id` and matching it against the client-supplied signature.

### 4. Coupon Calculation Engine
- **Features**: Percentage vs Fixed discounts, minimum order threshold validation, expiry checks, and single-use per customer enforcement for introductory promotions (`WELCOME10`).

---

## 🚀 6. Step-by-Step Execution Guide

### Prerequisites
1. **Java JDK 22** (or JDK 17/21)
2. **Apache Maven 3.9+** (installed at `C:\Users\USER\apache-maven-3.9.9\bin\mvn.cmd`)
3. **Node.js v20+ & npm**
4. **MySQL 8.0 Server** running locally on port 3306

---

### Step 1: Database Setup
1. Log into your MySQL instance:
   ```powershell
   mysql -u root -p
   ```
2. Run the database schema and sample seed files:
   ```sql
   source database/schema.sql;
   source database/data.sql;
   ```
   *Note: Spring Boot's `DataInitializer` also automatically verifies and seeds default roles and BCrypt-encoded demo users on startup!*

---

### Step 2: Run Backend (Spring Boot)
1. Open a terminal and navigate to the backend directory:
   ```powershell
   cd ShopSphere/backend
   ```
2. Build and run the application:
   ```powershell
   mvn spring-boot:run
   ```
   *(Or using the full path: `& "C:\Users\USER\apache-maven-3.9.9\bin\mvn.cmd" spring-boot:run`)*
3. The server starts at `http://localhost:8080`.

---

### Step 3: Run Frontend (React + Vite)
1. Open a second terminal and navigate to the frontend directory:
   ```powershell
   cd ShopSphere/frontend
   ```
2. Install dependencies (if not already installed):
   ```powershell
   npm install
   ```
3. Start the development server:
   ```powershell
   npm run dev
   ```
4. Access the web application at `http://localhost:5173`.

---

## 📂 7. Project Directory Structure

```text
ShopSphere/
├── backend/
│   ├── src/main/java/com/shopsphere/
│   │   ├── config/          # Spring Security, CORS, JWT & DataInitializer
│   │   ├── controller/      # REST Endpoints (Auth, Products, Cart, Orders, Admin)
│   │   ├── dto/             # Request & Response Data Transfer Objects
│   │   ├── entity/          # JPA Hibernate Relational Entities & Enums
│   │   ├── exception/       # GlobalExceptionHandler & Custom Exceptions
│   │   ├── repository/      # Spring Data JPA Repository Interfaces
│   │   ├── security/        # JWT Token Provider, UserDetails & Filter
│   │   └── service/         # Core Business Logic & Transaction Services
│   ├── src/main/resources/  # application.properties
│   └── pom.xml              # Maven dependencies & build plugins
│
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios API client modules
│   │   ├── components/      # Navbar, Footer, ProductCard, Timeline, Filter
│   │   ├── layouts/         # MainLayout (Customer) & AdminLayout (Sidebar)
│   │   ├── pages/customer/  # Home, Listing, Details, Cart, Checkout, Tracking
│   │   ├── pages/admin/     # Analytics, Products, Orders, Stock, Coupons
│   │   ├── store/           # Redux Toolkit Slices (Auth, Cart, Wishlist)
│   │   └── index.css        # Responsive Design System
│   ├── package.json
│   └── vite.config.js
│
├── database/
│   ├── schema.sql           # Complete 19-table DDL script with constraints
│   └── data.sql             # Realistic catalog, inventory, and demo seed data
│
├── docs/
│   └── API-documentation.md # Exhaustive REST API specification
│
└── README.md
```

---

## 🛡️ 8. Security & Roles

- **Public**:
  - `POST /api/auth/**` (Login, Register)
  - `GET /api/products/**` (Browse catalog, search, recommendations)
  - `GET /api/categories/**` & `GET /api/brands/**`
  - `GET /api/reviews/product/**`
  - `GET /api/coupons/active`
- **Authenticated Customer (`ROLE_CUSTOMER` or `ROLE_ADMIN`)**:
  - `/api/cart/**`
  - `/api/wishlist/**`
  - `/api/addresses/**`
  - `/api/orders/**`
  - `POST /api/reviews` (Verified purchases only)
- **Administrator (`ROLE_ADMIN`)**:
  - `/api/admin/dashboard`
  - `/api/admin/products/**`
  - `/api/admin/orders/**`
  - `/api/admin/inventory/**`
  - `/api/admin/coupons/**`
  - `/api/admin/users/**`
