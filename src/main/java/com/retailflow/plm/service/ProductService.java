package com.retailflow.plm.service;

import com.retailflow.plm.model.Product;
import com.retailflow.plm.model.ProductStatus;
import com.retailflow.plm.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional // Ensures methods run within a database transaction
public class ProductService {
    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);
    
    @Autowired
    private ProductRepository productRepository; // Spring automatically injects ProductRepository
    
    /**
     * Retrieves all products from the database.
     * @return A list of all Product objects.
     */
    public List<Product> getAllProducts() {
        logger.info("Fetching all products");
        return productRepository.findAll();
    }
    
    /**
     * Retrieves a single product by its database ID.
     * @param id The unique ID of the product.
     * @return An Optional containing the Product if found, or empty if not.
     */
    public Optional<Product> getProductById(Long id) {
        logger.info("Fetching product with ID: {}", id);
        return productRepository.findById(id);
    }
    
    /**
     * Retrieves a single product by its business product ID.
     * @param productId The unique business ID (e.g., PRD-001) of the product.
     * @return An Optional containing the Product if found, or empty if not.
     */
    public Optional<Product> getProductByProductId(String productId) {
        logger.info("Fetching product with Product ID: {}", productId);
        return productRepository.findByProductId(productId);
    }
    
    /**
     * Creates a new product in the database.
     * @param product The Product object to save.
     * @return The saved Product object, including its generated ID.
     */
    public Product createProduct(Product product) {
        logger.info("Creating new product: {}", product.getProductId());
        // createdAt and updatedAt are set automatically by @PrePersist in Product entity
        return productRepository.save(product);
    }
    
    /**
     * Updates the status of an existing product.
     * @param id The ID of the product to update.
     * @param newStatus The new ProductStatus.
     * @return An Optional containing the updated Product if found, or empty if not.
     */
    public Optional<Product> updateProductStatus(Long id, ProductStatus newStatus) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            ProductStatus oldStatus = product.getStatus(); // Log old status for audit trail (though not implemented in product_status_history here)
            product.setStatus(newStatus);
            Product savedProduct = productRepository.save(product); // updatedAt is set automatically by @PreUpdate
            logger.info("Updated product {} status from {} to {}", 
                       product.getProductId(), oldStatus, newStatus);
            return Optional.of(savedProduct);
        }
        logger.warn("Product with ID {} not found for status update", id);
        return Optional.empty();
    }
    
    /**
     * Retrieves a list of products filtered by their status.
     * @param status The ProductStatus to filter by.
     * @return A list of Product objects matching the given status.
     */
    public List<Product> getProductsByStatus(ProductStatus status) {
        logger.info("Fetching products with status: {}", status);
        return productRepository.findByStatus(status);
    }
}
