# ShopSphere REST API Documentation

Base URL: `http://localhost:8080/api`

---

## 1. Authentication (`/api/auth`)

### 1.1 Register Customer
- **Endpoint**: `POST /api/auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "firstName": "Rahul",
  "lastName": "Sharma",
  "email": "customer@shopsphere.com",
  "password": "Customer@123",
  "phone": "+91 9123456780"
}
```
- **Response** (`200 OK`):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 2,
  "firstName": "Rahul",
  "lastName": "Sharma",
  "email": "customer@shopsphere.com",
  "roles": ["ROLE_CUSTOMER"]
}
```

### 1.2 Login
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "admin@shopsphere.com",
  "password": "Admin@123"
}
```
- **Response** (`200 OK`):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 1,
  "firstName": "System",
  "lastName": "Admin",
  "email": "admin@shopsphere.com",
  "roles": ["ROLE_ADMIN"]
}
```

### 1.3 Current User Info
- **Endpoint**: `GET /api/auth/me`
- **Header**: `Authorization: Bearer <token>`
- **Response** (`200 OK`):
```json
{
  "id": 2,
  "fullName": "Rahul Sharma",
  "email": "customer@shopsphere.com",
  "roles": ["ROLE_CUSTOMER"]
}
```

---

## 2. Product Catalog (`/api/products`)

### 2.1 Multi-Filter & Search
- **Endpoint**: `GET /api/products`
- **Query Parameters**:
  - `keyword` (e.g. `headphone`)
  - `categoryId` (e.g. `1`)
  - `minPrice` & `maxPrice` (e.g. `1000`, `30000`)
  - `minRating` (e.g. `4.0`)
  - `page` (default: 0) & `size` (default: 12)
  - `sortBy` (`price`, `ratingAvg`, `createdAt`, `id`)
  - `sortDir` (`asc`, `desc`)
- **Response** (`200 OK`):
```json
{
  "content": [
    {
      "id": 1,
      "name": "Sony WH-1000XM5 Wireless Headphones",
      "slug": "sony-wh-1000xm5-headphones",
      "price": 29990.00,
      "discountPercent": 15.00,
      "discountedPrice": 25491.50,
      "sku": "SONY-WH5-BLK",
      "brandName": "Sony",
      "categoryName": "Electronics",
      "ratingAvg": 4.80,
      "ratingCount": 24,
      "stockQuantity": 45,
      "primaryImageUrl": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"
    }
  ],
  "totalElements": 1,
  "totalPages": 1
}
```

### 2.2 Get Product By ID
- **Endpoint**: `GET /api/products/{id}`

### 2.3 Curated Collections
- `GET /api/products/featured`
- `GET /api/products/best-sellers`
- `GET /api/products/new-arrivals`
- `GET /api/products/{id}/related`

---

## 3. Shopping Cart (`/api/cart`)

### 3.1 Get Cart & Apply Coupon
- **Endpoint**: `GET /api/cart?couponCode=WELCOME10`
- **Header**: `Authorization: Bearer <token>`
- **Response** (`200 OK`):
```json
{
  "cartId": 2,
  "items": [
    {
      "itemId": 1,
      "productId": 1,
      "productName": "Sony WH-1000XM5 Wireless Headphones",
      "discountedPrice": 25491.50,
      "quantity": 1,
      "subtotal": 25491.50,
      "inStock": true,
      "availableStock": 45
    }
  ],
  "totalItems": 1,
  "subtotal": 25491.50,
  "discountAmount": 2549.15,
  "taxAmount": 4129.62,
  "shippingAmount": 0.00,
  "totalAmount": 27071.97,
  "appliedCoupon": "WELCOME10"
}
```

### 3.2 Add Item to Cart
- **Endpoint**: `POST /api/cart/items`
- **Request Body**:
```json
{
  "productId": 1,
  "quantity": 1
}
```

### 3.3 Update Item Quantity
- **Endpoint**: `PUT /api/cart/items/{itemId}`
```json
{ "quantity": 2 }
```

### 3.4 Remove Item
- **Endpoint**: `DELETE /api/cart/items/{itemId}`

---

## 4. Orders & Payment (`/api/orders`)

### 4.1 Create Order
- **Endpoint**: `POST /api/orders`
- **Request Body**:
```json
{
  "addressId": 1,
  "couponCode": "WELCOME10",
  "paymentMethod": "RAZORPAY",
  "notes": "Deliver during business hours"
}
```
- **Response** (`200 OK`):
```json
{
  "id": 2,
  "orderNumber": "ORD-20261008-AB12CD",
  "totalAmount": 27071.97,
  "orderStatus": "PLACED",
  "paymentStatus": "PENDING",
  "razorpayOrderId": "order_a1b2c3d4e5f6g7"
}
```

### 4.2 Verify Razorpay Payment Signature
- **Endpoint**: `POST /api/orders/verify-payment`
- **Request Body**:
```json
{
  "orderId": 2,
  "razorpayOrderId": "order_a1b2c3d4e5f6g7",
  "razorpayPaymentId": "pay_982341249",
  "razorpaySignature": "sig_demo_verified_hash"
}
```
- **Response** (`200 OK`):
```json
{
  "id": 2,
  "orderNumber": "ORD-20261008-AB12CD",
  "orderStatus": "CONFIRMED",
  "paymentStatus": "COMPLETED"
}
```

### 4.3 Cancel Order
- **Endpoint**: `PUT /api/orders/{id}/cancel`
*(Automatically restores physical inventory quantity)*

---

## 5. Verified Purchase Reviews (`/api/reviews`)

### 5.1 Add or Update Review
- **Endpoint**: `POST /api/reviews`
- **Header**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "productId": 1,
  "rating": 5,
  "comment": "Exceptional active noise cancellation and comfort for long workdays."
}
```
- **Business Rule Rejection** (`400 Bad Request` if user has not purchased product):
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Verification Failed: You can only review products that have been delivered to your address."
}
```

---

## 6. Admin Portal APIs (`/api/admin`)
*(Protected by `hasAuthority('ROLE_ADMIN')`)*

- `GET /api/admin/dashboard` - Complete KPI metrics, monthly sales, and low-stock alerts
- `GET /api/admin/orders` - View all customer orders
- `PUT /api/admin/orders/{id}/status` - Advance order lifecycle (`SHIPPED`, `DELIVERED`, etc.)
- `POST /api/admin/products` - Create new product
- `PUT /api/admin/products/{id}` - Update product
- `DELETE /api/admin/products/{id}` - Delete product
- `GET /api/admin/inventory` - Stock levels and reorder thresholds
- `PUT /api/admin/inventory/{productId}?quantity=50&reorderLevel=5` - Restock inventory
- `GET /api/admin/coupons` - List promo codes
- `POST /api/admin/coupons` - Create new promo coupon
- `GET /api/admin/users` - Directory of registered accounts
