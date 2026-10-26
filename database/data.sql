-- =====================================================================
-- ShopSphere Seed Data
-- Categories, Brands, Products, Inventory, Coupons, and Demo Accounts
-- =====================================================================

USE shopsphere_db;

-- 1. Insert Roles
INSERT INTO roles (id, name) VALUES
(1, 'ROLE_CUSTOMER'),
(2, 'ROLE_ADMIN')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 2. Insert Users (Admin: Admin@123, Customer: Customer@123)
-- Spring Boot DataInitializer will verify and ensure BCrypt encoding at startup
INSERT INTO users (id, first_name, last_name, email, password, phone, status) VALUES
(1, 'System', 'Admin', 'admin@shopsphere.com', '$2a$10$wE8aH3jW7aO9K7t6h9cEe.mF3PjA8E3L9fG0V1sD5rK8aO3qN8q6y', '+91 9876543210', 'ACTIVE'),
(2, 'Rahul', 'Sharma', 'customer@shopsphere.com', '$2a$10$wE8aH3jW7aO9K7t6h9cEe.mF3PjA8E3L9fG0V1sD5rK8aO3qN8q6y', '+91 9123456780', 'ACTIVE')
ON DUPLICATE KEY UPDATE first_name = VALUES(first_name);

-- 3. Map User Roles
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 2), -- Admin gets ROLE_ADMIN
(2, 1)  -- Rahul gets ROLE_CUSTOMER
ON DUPLICATE KEY UPDATE role_id = VALUES(role_id);

-- 4. Insert Categories
INSERT INTO categories (id, name, slug, description, image_url) VALUES
(1, 'Electronics', 'electronics', 'Smartphones, audio, computing gear, and consumer gadgets', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600'),
(2, 'Fashion', 'fashion', 'Apparel, footwear, streetwear, and contemporary style', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600'),
(3, 'Home & Living', 'home-living', 'Modern home appliances, kitchenware, and decor', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600'),
(4, 'Fitness & Sports', 'fitness-sports', 'Workout gear, training accessories, and health essentials', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600'),
(5, 'Books & Learning', 'books-learning', 'Best-selling technology books, design manuals, and literature', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 5. Insert Brands
INSERT INTO brands (id, name, slug, logo_url) VALUES
(1, 'Apple', 'apple', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200'),
(2, 'Samsung', 'samsung', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200'),
(3, 'Sony', 'sony', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200'),
(4, 'Nike', 'nike', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200'),
(5, 'Adidas', 'adidas', 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=200'),
(6, 'Logitech', 'logitech', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200'),
(7, 'Philips', 'philips', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200'),
(8, 'O\'Reilly', 'oreilly', 'https://images.unsplash.com/photo-1532012164546-f432f2e30018?w=200')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 6. Insert Products
INSERT INTO products (id, name, slug, description, price, discount_percent, sku, brand_id, category_id, is_featured, is_active, rating_avg, rating_count) VALUES
(1, 'Sony WH-1000XM5 Wireless Headphones', 'sony-wh-1000xm5-headphones', 'Industry-leading noise canceling with two processors and 8 microphones for unprecedented noise cancellation. Crystal clear hands-free calling.', 29990.00, 15.00, 'SONY-WH5-BLK', 3, 1, TRUE, TRUE, 4.80, 24),
(2, 'Apple MacBook Air M3 (16GB, 512GB)', 'apple-macbook-air-m3-16-512', 'Lean. Mean. M3 machine. Incredibly thin and blazing fast laptop with Liquid Retina display and up to 18 hours of battery life.', 114900.00, 10.00, 'APL-MBA-M3-ST', 1, 1, TRUE, TRUE, 4.90, 42),
(3, 'Samsung Galaxy S24 Ultra (256GB)', 'samsung-galaxy-s24-ultra', 'Galaxy AI is here. Titanium exterior, flat 6.8-inch display, 200MP camera system, and embedded S Pen for ultimate productivity.', 129999.00, 8.00, 'SAM-S24U-TI', 2, 1, TRUE, TRUE, 4.75, 18),
(4, 'Logitech MX Master 3S Wireless Mouse', 'logitech-mx-master-3s-mouse', 'Quiet clicks and 8K DPI any-surface tracking. Ergonomic comfort shape and electromagnetic MagSpeed scrolling wheel.', 9495.00, 12.00, 'LOG-MXM3S-GRY', 6, 1, FALSE, TRUE, 4.85, 31),
(5, 'Nike Air Zoom Pegasus 40 Running Shoes', 'nike-air-zoom-pegasus-40', 'A springy ride for every run, the Peg’s familiar, just-for-you feel returns to help you accomplish your personal goals.', 10495.00, 20.00, 'NKE-PEG40-WHT', 4, 2, TRUE, TRUE, 4.60, 15),
(6, 'Adidas Essentials 3-Stripes Hoodie', 'adidas-essentials-3stripes-hoodie', 'Classic sportswear style made with cozy fleece. Full zip closure, ribbed cuffs, and iconic kangaroo pocket.', 3999.00, 25.00, 'ADI-HOOD-BLK', 5, 2, FALSE, TRUE, 4.50, 19),
(7, 'Philips Smart LED Air Fryer XXL', 'philips-smart-led-air-fryer-xxl', 'Rapid Air technology for delicious, guilt-free crispy fries and grills using up to 90% less oil. Digital touchscreen with 7 presets.', 12999.00, 18.00, 'PHL-AF-XXL-01', 7, 3, TRUE, TRUE, 4.70, 28),
(8, 'Ergonomic Memory Foam Lumbar Cushion', 'ergonomic-memory-foam-lumbar-cushion', 'High-density orthopedic memory foam back support pillow with breathable mesh cover for office and car seats.', 1899.00, 30.00, 'HOM-LUMB-BLK', NULL, 3, FALSE, TRUE, 4.40, 12),
(9, 'Smart Adjustable Dumbbells Set (24kg)', 'smart-adjustable-dumbbells-set-24kg', 'Rapid weight selection dial from 2.5kg to 24kg per dumbbell. Space-saving all-in-one home strength gym training gear.', 18500.00, 10.00, 'FIT-DUMB-24K', NULL, 4, TRUE, TRUE, 4.65, 9),
(10, 'Designing Data-Intensive Applications', 'designing-data-intensive-applications', 'The definitive guide to distributed data systems, reliability, scalability, and maintainability by Martin Kleppmann.', 2450.00, 15.00, 'BK-DDIA-OREIL', 8, 5, TRUE, TRUE, 4.95, 53),
(11, 'Clean Architecture by Robert C. Martin', 'clean-architecture-uncle-bob', 'A Craftsman\'s Guide to Software Structure and Design. Essential reading for every professional full-stack engineer.', 1999.00, 20.00, 'BK-CLEAN-ARCH', 8, 5, FALSE, TRUE, 4.80, 34),
(12, 'Logitech Brio 4K Ultra HD Webcam', 'logitech-brio-4k-webcam', 'Premium 4K webcam with HDR, auto-light correction RightLight 3, and dual noise-canceling stereo microphones.', 17995.00, 14.00, 'LOG-BRIO-4K', 6, 1, FALSE, TRUE, 4.55, 11)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 7. Insert Product Images
INSERT INTO product_images (product_id, image_url, is_primary) VALUES
(1, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', TRUE),
(1, 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800', FALSE),
(2, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', TRUE),
(2, 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800', FALSE),
(3, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800', TRUE),
(4, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800', TRUE),
(5, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', TRUE),
(6, 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800', TRUE),
(7, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800', TRUE),
(8, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800', TRUE),
(9, 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800', TRUE),
(10, 'https://images.unsplash.com/photo-1532012164546-f432f2e30018?w=800', TRUE),
(11, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800', TRUE),
(12, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800', TRUE);

-- 8. Insert Inventory (Including some low stock items for low-stock alert showcase!)
INSERT INTO inventory (product_id, quantity, reserved_quantity, reorder_level) VALUES
(1, 45, 0, 10),
(2, 4, 0, 5),   -- LOW STOCK ALERT (4 < 5)
(3, 18, 0, 5),
(4, 3, 0, 5),   -- LOW STOCK ALERT (3 < 5)
(5, 50, 0, 10),
(6, 35, 0, 8),
(7, 22, 0, 5),
(8, 60, 0, 15),
(9, 2, 0, 5),   -- CRITICAL LOW STOCK ALERT (2 < 5)
(10, 40, 0, 10),
(11, 28, 0, 8),
(12, 15, 0, 5)
ON DUPLICATE KEY UPDATE quantity = VALUES(quantity);

-- 9. Insert Coupons
INSERT INTO coupons (id, code, discount_type, discount_value, min_order_amount, max_discount_amount, start_date, expiry_date, usage_limit, used_count, is_active) VALUES
(1, 'WELCOME10', 'PERCENTAGE', 10.00, 1000.00, 1500.00, '2025-01-01', '2027-12-31', 500, 12, TRUE),
(2, 'FLAT500', 'FIXED', 500.00, 2999.00, 500.00, '2025-01-01', '2027-12-31', 200, 45, TRUE),
(3, 'FESTIVE20', 'PERCENTAGE', 20.00, 4999.00, 3000.00, '2025-01-01', '2027-12-31', 300, 8, TRUE)
ON DUPLICATE KEY UPDATE discount_value = VALUES(discount_value);

-- 10. Insert Customer Address
INSERT INTO addresses (id, user_id, full_name, phone, street, city, state, postal_code, country, address_type, is_default) VALUES
(1, 2, 'Rahul Sharma', '+91 9123456780', 'Flat 402, Skyline Residency, Outer Ring Road', 'Bengaluru', 'Karnataka', '560103', 'India', 'HOME', TRUE),
(2, 2, 'Rahul Sharma', '+91 9123456780', 'Tech Park Block B, Indiranagar', 'Bengaluru', 'Karnataka', '560038', 'India', 'OFFICE', FALSE)
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

-- 11. Seed a completed order for verified purchase review demonstration
INSERT INTO orders (id, order_number, user_id, address_id, subtotal, discount_amount, tax_amount, shipping_amount, total_amount, coupon_code, order_status, payment_status, tracking_number, created_at) VALUES
(1, 'ORD-2026-0001', 2, 1, 25491.50, 2549.15, 4129.62, 0.00, 27071.97, 'WELCOME10', 'DELIVERED', 'COMPLETED', 'TRK-BLR-884920', DATE_SUB(NOW(), INTERVAL 5 DAY))
ON DUPLICATE KEY UPDATE order_number = VALUES(order_number);

INSERT INTO order_items (id, order_id, product_id, product_name, product_image, quantity, unit_price, subtotal) VALUES
(1, 1, 1, 'Sony WH-1000XM5 Wireless Headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 1, 25491.50, 25491.50)
ON DUPLICATE KEY UPDATE product_name = VALUES(product_name);

INSERT INTO payments (id, order_id, payment_method, transaction_id, razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, status) VALUES
(1, 1, 'RAZORPAY', 'TXN_DEMO_998822', 'order_demo_1001', 'pay_demo_992211', 'sig_demo_verified_hash', 27071.97, 'SUCCESS')
ON DUPLICATE KEY UPDATE status = VALUES(status);

-- Verified Purchase Review for Product 1 from Customer Rahul
INSERT INTO reviews (id, user_id, product_id, rating, comment, is_verified_purchase, created_at) VALUES
(1, 2, 1, 5, 'Unbelievable sound isolation on flights and daily commutes. Extremely lightweight and battery lasts for days!', TRUE, DATE_SUB(NOW(), INTERVAL 3 DAY))
ON DUPLICATE KEY UPDATE comment = VALUES(comment);
