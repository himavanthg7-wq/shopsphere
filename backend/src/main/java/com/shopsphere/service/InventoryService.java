package com.shopsphere.service;

import com.shopsphere.entity.Inventory;
import com.shopsphere.entity.Product;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.InventoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InventoryService {

    private static final Logger log = LoggerFactory.getLogger(InventoryService.class);
    private final InventoryRepository inventoryRepository;

    public InventoryService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    @Transactional
    public void deductStock(Product product, int quantity) {
        Inventory inventory = inventoryRepository.findByProductId(product.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found for product: " + product.getName()));

        if (inventory.getQuantity() < quantity) {
            throw new BadRequestException("Insufficient stock for product: " + product.getName() +
                    ". Available: " + inventory.getQuantity() + ", Requested: " + quantity);
        }

        inventory.setQuantity(inventory.getQuantity() - quantity);
        inventoryRepository.save(inventory);

        if (inventory.getQuantity() <= inventory.getReorderLevel()) {
            log.warn("⚠️ LOW STOCK ALERT: Product '{}' (ID: {}) remaining stock is {}",
                    product.getName(), product.getId(), inventory.getQuantity());
        }
    }

    @Transactional
    public void restoreStock(Product product, int quantity) {
        inventoryRepository.findByProductId(product.getId()).ifPresent(inventory -> {
            inventory.setQuantity(inventory.getQuantity() + quantity);
            inventoryRepository.save(inventory);
            log.info("Restored {} units to product {}", quantity, product.getName());
        });
    }

    @Transactional
    public Inventory updateStock(Long productId, int newQuantity, Integer reorderLevel) {
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found for product ID: " + productId));

        inventory.setQuantity(newQuantity);
        if (reorderLevel != null) {
            inventory.setReorderLevel(reorderLevel);
        }
        return inventoryRepository.save(inventory);
    }

    public List<Inventory> getLowStockInventories() {
        return inventoryRepository.findLowStockInventories();
    }
}
