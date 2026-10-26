package com.shopsphere.config;

import com.shopsphere.entity.*;
import com.shopsphere.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final ProductImageRepository productImageRepository;
    private final CouponRepository couponRepository;

    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           CategoryRepository categoryRepository,
                           BrandRepository brandRepository,
                           ProductRepository productRepository,
                           InventoryRepository inventoryRepository,
                           ProductImageRepository productImageRepository,
                           CouponRepository couponRepository) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
        this.productImageRepository = productImageRepository;
        this.couponRepository = couponRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // Ensure roles
        Role customerRole = roleRepository.findByName("ROLE_CUSTOMER")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_CUSTOMER")));
        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_ADMIN")));

        // Ensure Admin user
        userRepository.findByEmail("admin@shopsphere.com").ifPresentOrElse(
                admin -> {
                    admin.setPassword(passwordEncoder.encode("Admin@123"));
                    Set<Role> roles = new HashSet<>();
                    roles.add(adminRole);
                    admin.setRoles(roles);
                    userRepository.save(admin);
                },
                () -> {
                    User admin = new User("System", "Admin", "admin@shopsphere.com",
                            passwordEncoder.encode("Admin@123"), "+91 9876543210");
                    Set<Role> roles = new HashSet<>();
                    roles.add(adminRole);
                    admin.setRoles(roles);
                    userRepository.save(admin);
                }
        );

        // Ensure Customer user
        userRepository.findByEmail("customer@shopsphere.com").ifPresentOrElse(
                customer -> {
                    customer.setPassword(passwordEncoder.encode("Customer@123"));
                    Set<Role> roles = new HashSet<>();
                    roles.add(customerRole);
                    customer.setRoles(roles);
                    userRepository.save(customer);
                },
                () -> {
                    User customer = new User("Rahul", "Sharma", "customer@shopsphere.com",
                            passwordEncoder.encode("Customer@123"), "+91 9123456780");
                    Set<Role> roles = new HashSet<>();
                    roles.add(customerRole);
                    customer.setRoles(roles);
                    userRepository.save(customer);
                }
        );

        seedCatalogIfEmpty();
    }

    private void seedCatalogIfEmpty() {
        if (productRepository.count() > 0) return;

        Category electronics = categoryRepository.save(new Category("Electronics", "electronics", "Smartphones, audio, computing gear, and consumer gadgets", "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600"));
        Category fashion = categoryRepository.save(new Category("Fashion", "fashion", "Apparel, footwear, streetwear, and contemporary style", "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600"));
        Category home = categoryRepository.save(new Category("Home & Living", "home-living", "Modern home appliances, kitchenware, and decor", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600"));
        Category fitness = categoryRepository.save(new Category("Fitness & Sports", "fitness-sports", "Workout gear, training accessories, and health essentials", "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600"));
        Category books = categoryRepository.save(new Category("Books & Learning", "books-learning", "Best-selling technology books, design manuals, and literature", "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600"));

        Brand apple = brandRepository.save(new Brand("Apple", "apple", "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200"));
        Brand samsung = brandRepository.save(new Brand("Samsung", "samsung", "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200"));
        Brand sony = brandRepository.save(new Brand("Sony", "sony", "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200"));
        Brand nike = brandRepository.save(new Brand("Nike", "nike", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200"));
        Brand adidas = brandRepository.save(new Brand("Adidas", "adidas", "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=200"));
        Brand logitech = brandRepository.save(new Brand("Logitech", "logitech", "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200"));
        Brand philips = brandRepository.save(new Brand("Philips", "philips", "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200"));
        Brand oreilly = brandRepository.save(new Brand("O'Reilly", "oreilly", "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200"));

        createProduct("Sony WH-1000XM5 Wireless Headphones", "sony-wh-1000xm5-headphones",
                "Industry-leading noise canceling with two processors and 8 microphones for unprecedented noise cancellation. Crystal clear hands-free calling.",
                new BigDecimal("29990.00"), new BigDecimal("15.00"), "SONY-WH5-BLK", sony, electronics, true, new BigDecimal("4.80"), 24, 18, 5,
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800");

        createProduct("Apple MacBook Air M3 (16GB, 512GB)", "apple-macbook-air-m3-16-512",
                "Lean. Mean. M3 machine. Incredibly thin and blazing fast laptop with Liquid Retina display and up to 18 hours of battery life.",
                new BigDecimal("114900.00"), new BigDecimal("10.00"), "APL-MBA-M3-ST", apple, electronics, true, new BigDecimal("4.90"), 42, 12, 3,
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800");

        createProduct("Samsung Galaxy S24 Ultra (256GB)", "samsung-galaxy-s24-ultra",
                "Galaxy AI is here. Titanium exterior, flat 6.8-inch display, 200MP camera system, and embedded S Pen for ultimate productivity.",
                new BigDecimal("129999.00"), new BigDecimal("8.00"), "SAM-S24U-TI", samsung, electronics, true, new BigDecimal("4.75"), 18, 15, 4,
                "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800");

        createProduct("Logitech MX Master 3S Wireless Mouse", "logitech-mx-master-3s-mouse",
                "Quiet clicks and 8K DPI any-surface tracking. Ergonomic comfort shape and electromagnetic MagSpeed scrolling wheel.",
                new BigDecimal("9495.00"), new BigDecimal("12.00"), "LOG-MXM3S-GRY", logitech, electronics, false, new BigDecimal("4.85"), 31, 35, 10,
                "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800");

        createProduct("Nike Air Zoom Pegasus 40 Running Shoes", "nike-air-zoom-pegasus-40",
                "A springy ride for every run, the Peg’s familiar, just-for-you feel returns to help you accomplish your personal goals.",
                new BigDecimal("10495.00"), new BigDecimal("20.00"), "NKE-PEG40-WHT", nike, fashion, true, new BigDecimal("4.60"), 15, 22, 5,
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800");

        createProduct("Adidas Essentials 3-Stripes Hoodie", "adidas-essentials-3stripes-hoodie",
                "Classic sportswear style made with cozy fleece. Full zip closure, ribbed cuffs, and iconic kangaroo pocket.",
                new BigDecimal("3999.00"), new BigDecimal("25.00"), "ADI-HOOD-BLK", adidas, fashion, false, new BigDecimal("4.50"), 19, 45, 10,
                "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800");

        createProduct("Philips Smart LED Air Fryer XXL", "philips-smart-led-air-fryer-xxl",
                "Rapid Air technology for delicious, guilt-free crispy fries and grills using up to 90% less oil. Digital touchscreen with 7 presets.",
                new BigDecimal("12999.00"), new BigDecimal("18.00"), "PHL-AF-XXL-01", philips, home, true, new BigDecimal("4.70"), 28, 8, 3,
                "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800");

        createProduct("Smart Adjustable Dumbbells Set (24kg)", "smart-adjustable-dumbbells-set-24kg",
                "Rapid weight selection dial from 2.5kg to 24kg per dumbbell. Space-saving all-in-one home strength gym training gear.",
                new BigDecimal("18500.00"), new BigDecimal("10.00"), "FIT-DUMB-24K", null, fitness, true, new BigDecimal("4.65"), 9, 7, 2,
                "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800");

        createProduct("Designing Data-Intensive Applications", "designing-data-intensive-applications",
                "The definitive guide to distributed data systems, reliability, scalability, and maintainability by Martin Kleppmann.",
                new BigDecimal("2450.00"), new BigDecimal("15.00"), "BK-DDIA-OREIL", oreilly, books, true, new BigDecimal("4.95"), 53, 50, 10,
                "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800",
                "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800",
                "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800");

        createProduct("Clean Architecture by Robert C. Martin", "clean-architecture-uncle-bob",
                "A Craftsman's Guide to Software Structure and Design. Essential reading for every professional full-stack engineer.",
                new BigDecimal("1999.00"), new BigDecimal("20.00"), "BK-CLEAN-ARCH", oreilly, books, false, new BigDecimal("4.80"), 34, 30, 8,
                "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800");

        // Seed coupons
        Coupon c1 = new Coupon();
        c1.setCode("WELCOME10");
        c1.setDiscountType(DiscountType.PERCENTAGE);
        c1.setDiscountValue(new BigDecimal("10.00"));
        c1.setMinOrderAmount(new BigDecimal("999.00"));
        c1.setMaxDiscountAmount(new BigDecimal("1000.00"));
        c1.setStartDate(LocalDate.now().minusDays(30));
        c1.setExpiryDate(LocalDate.now().plusDays(365));
        c1.setUsageLimit(5000);
        c1.setIsActive(true);
        couponRepository.save(c1);

        Coupon c2 = new Coupon();
        c2.setCode("FLAT500");
        c2.setDiscountType(DiscountType.FIXED);
        c2.setDiscountValue(new BigDecimal("500.00"));
        c2.setMinOrderAmount(new BigDecimal("4999.00"));
        c2.setStartDate(LocalDate.now().minusDays(30));
        c2.setExpiryDate(LocalDate.now().plusDays(365));
        c2.setUsageLimit(1000);
        c2.setIsActive(true);
        couponRepository.save(c2);
    }

    private void createProduct(String name, String slug, String description, BigDecimal price, BigDecimal discountPercent,
                               String sku, Brand brand, Category category, boolean isFeatured, BigDecimal ratingAvg,
                               int ratingCount, int quantity, int reorderLevel, String imageUrl, String... additionalImageUrls) {
        Product p = new Product();
        p.setName(name);
        p.setSlug(slug);
        p.setDescription(description);
        p.setPrice(price);
        p.setDiscountPercent(discountPercent);
        p.setSku(sku);
        p.setBrand(brand);
        p.setCategory(category);
        p.setIsFeatured(isFeatured);
        p.setIsActive(true);
        p.setRatingAvg(ratingAvg);
        p.setRatingCount(ratingCount);
        p = productRepository.save(p);

        Inventory inv = new Inventory(p, quantity, reorderLevel);
        inventoryRepository.save(inv);

        ProductImage img = new ProductImage(p, imageUrl, true);
        productImageRepository.save(img);

        if (additionalImageUrls != null) {
            for (String extraUrl : additionalImageUrls) {
                if (extraUrl != null && !extraUrl.isBlank()) {
                    productImageRepository.save(new ProductImage(p, extraUrl, false));
                }
            }
        }
    }
}
