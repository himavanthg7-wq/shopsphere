package com.shopsphere.service;

import com.shopsphere.dto.request.ProductRequest;
import com.shopsphere.dto.response.ProductResponse;
import com.shopsphere.entity.*;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.*;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final InventoryRepository inventoryRepository;

    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository,
                          BrandRepository brandRepository,
                          InventoryRepository inventoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
        this.inventoryRepository = inventoryRepository;
    }

    public Page<ProductResponse> searchProducts(String keyword, Long categoryId, Long brandId,
                                                BigDecimal minPrice, BigDecimal maxPrice, BigDecimal minRating,
                                                int page, int size, String sortBy, String sortDir) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir != null ? sortDir : "asc"),
                sortBy != null ? sortBy : "id");
        Pageable pageable = PageRequest.of(page, size, sort);

        return productRepository.searchProducts(
                (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null,
                categoryId, brandId, minPrice, maxPrice, minRating, pageable
        ).map(ProductResponse::fromEntity);
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return ProductResponse.fromEntity(product);
    }

    public ProductResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
        return ProductResponse.fromEntity(product);
    }

    public List<ProductResponse> getFeaturedProducts() {
        return productRepository.findByIsFeaturedTrueAndIsActiveTrue().stream()
                .map(ProductResponse::fromEntity).collect(Collectors.toList());
    }

    public List<ProductResponse> getBestSellers() {
        return productRepository.findTop8ByIsActiveTrueOrderByRatingAvgDesc().stream()
                .map(ProductResponse::fromEntity).collect(Collectors.toList());
    }

    public List<ProductResponse> getNewArrivals() {
        return productRepository.findTop8ByIsActiveTrueOrderByCreatedAtDesc().stream()
                .map(ProductResponse::fromEntity).collect(Collectors.toList());
    }

    public List<ProductResponse> getRelatedProducts(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
        if (product.getCategory() == null) {
            return List.of();
        }
        Pageable limit = PageRequest.of(0, 4);
        return productRepository.findByCategoryIdAndIdNotAndIsActiveTrue(product.getCategory().getId(), productId, limit)
                .stream().map(ProductResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setSlug(generateSlug(request.getName()));
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setDiscountPercent(request.getDiscountPercent() != null ? request.getDiscountPercent() : BigDecimal.ZERO);
        product.setSku(request.getSku());
        product.setIsFeatured(Boolean.TRUE.equals(request.getIsFeatured()));
        product.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
            product.setCategory(category);
        }

        if (request.getBrandId() != null) {
            Brand brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + request.getBrandId()));
            product.setBrand(brand);
        }

        // Handle Images
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            List<ProductImage> images = new ArrayList<>();
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                images.add(new ProductImage(product, request.getImageUrls().get(i), i == 0));
            }
            product.setImages(images);
        }

        Product saved = productRepository.save(product);

        // Create inventory
        int qty = request.getInitialStock() != null ? request.getInitialStock() : 10;
        int reorder = request.getReorderLevel() != null ? request.getReorderLevel() : 5;
        Inventory inv = new Inventory(saved, qty, reorder);
        inventoryRepository.save(inv);
        saved.setInventory(inv);

        return ProductResponse.fromEntity(saved);
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        if (request.getDiscountPercent() != null) {
            product.setDiscountPercent(request.getDiscountPercent());
        }
        if (request.getSku() != null) {
            product.setSku(request.getSku());
        }
        if (request.getIsFeatured() != null) {
            product.setIsFeatured(request.getIsFeatured());
        }
        if (request.getIsActive() != null) {
            product.setIsActive(request.getIsActive());
        }

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
            product.setCategory(category);
        }

        if (request.getBrandId() != null) {
            Brand brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + request.getBrandId()));
            product.setBrand(brand);
        }

        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            product.getImages().clear();
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                product.getImages().add(new ProductImage(product, request.getImageUrls().get(i), i == 0));
            }
        }

        if (request.getInitialStock() != null) {
            Inventory inv = product.getInventory();
            if (inv == null) {
                inv = new Inventory(product, request.getInitialStock(), request.getReorderLevel() != null ? request.getReorderLevel() : 5);
            } else {
                inv.setQuantity(request.getInitialStock());
                if (request.getReorderLevel() != null) {
                    inv.setReorderLevel(request.getReorderLevel());
                }
            }
            inventoryRepository.save(inv);
            product.setInventory(inv);
        }

        return ProductResponse.fromEntity(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    private String generateSlug(String name) {
        String base = name.toLowerCase(Locale.ENGLISH).replaceAll("[^a-z0-9\\s-]", "").replaceAll("\\s+", "-");
        String slug = base;
        int count = 1;
        while (productRepository.findBySlug(slug).isPresent()) {
            slug = base + "-" + count++;
        }
        return slug;
    }
}
