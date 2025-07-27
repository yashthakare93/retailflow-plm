package com.retailflow.plm.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Represents the Product entity mapped to the 'products' table in the database.
 * Stores information related to each product in the PLM system.
 */
@Entity
@Table(name = "products")
public class Product {

    // Primary key with auto-increment strategy
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Unique identifier for the product (business key)
    @Column(name = "product_id", unique = true, nullable = false)
    private String productId;

    // Name of the product (required)
    @Column(nullable = false)
    private String name;

    // Description of the product (optional)
    private String description;

    // Product category (e.g., electronics, apparel)
    private String category;

    // Enum to represent current product status (e.g., DESIGN, MANUFACTURING)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductStatus status = ProductStatus.DESIGN;

    // Timestamp when the product was first created
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Timestamp when the product was last updated
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Automatically sets creation and update timestamps before inserting into the database.
     */
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    /**
     * Automatically updates the 'updatedAt' timestamp before updating the record.
     */
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * Default constructor required for JPA and JSON deserialization.
     */
    public Product() {}

    /**
     * Parameterized constructor to easily create a product instance.
     * Useful during service or controller layer operations.
     */
    public Product(String productId, String name, String description, String category) {
        this.productId = productId;
        this.name = name;
        this.description = description;
        this.category = category;
    }

    // Getters and setters are required for JPA and JSON serialization/deserialization

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public ProductStatus getStatus() {
        return status;
    }

    public void setStatus(ProductStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
