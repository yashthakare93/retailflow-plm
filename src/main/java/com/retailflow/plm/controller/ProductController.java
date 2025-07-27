package com.retailflow.plm.controller;

import com.retailflow.plm.model.Product;
import com.retailflow.plm.model.ProductStatus;
import com.retailflow.plm.service.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * REST controller for managing product-related operations.
 * 
 * <p>Handles endpoints for creating, retrieving, and updating products and filtering by status.
 * All endpoints are prefixed with "/api/products".</p>
 */
@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*") // Allows cross-origin requests from any domain (suitable for dev)
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    @Autowired
    private ProductService productService;

    /**
     * GET /api/products
     * 
     * Retrieves and returns a list of all products in the system.
     * 
     * @return List of Product objects with HTTP 200 OK
     */
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        logger.info("GET /api/products - Fetching all products");
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    /**
     * GET /api/products/{id}
     * 
     * Retrieves a specific product by its unique ID.
     * 
     * @param id The product ID to look up
     * @return Product if found (HTTP 200 OK), otherwise HTTP 404 Not Found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        logger.info("GET /api/products/{} - Fetching product by ID", id);
        Optional<Product> product = productService.getProductById(id);
        return product.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/products
     * 
     * Creates a new product with the details provided in the request body.
     * 
     * @param product The Product object to be created
     * @return The created product (HTTP 201 Created), or HTTP 400 Bad Request on failure
     */
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        logger.info("POST /api/products - Creating new product: {}", product.getProductId());
        try {
            Product createdProduct = productService.createProduct(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
        } catch (Exception e) {
            logger.error("Error creating product: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * PUT /api/products/{id}/status
     * 
     * Updates the status of an existing product.
     * 
     * @param id The ID of the product to update
     * @param statusUpdate JSON body containing a "status" field (e.g., {"status": "PROTOTYPE"})
     * @return The updated product (HTTP 200 OK), HTTP 404 Not Found if not found, or HTTP 400 if invalid status
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<Product> updateProductStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        logger.info("PUT /api/products/{}/status - Updating product status", id);
        try {
            ProductStatus newStatus = ProductStatus.valueOf(statusUpdate.get("status").toUpperCase());
            Optional<Product> updatedProduct = productService.updateProductStatus(id, newStatus);
            return updatedProduct.map(ResponseEntity::ok)
                                 .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            logger.error("Invalid product status provided: {}", statusUpdate.get("status"), e);
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            logger.error("Error updating product status for ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/products/status/{status}
     * 
     * Retrieves all products filtered by a specific status.
     * 
     * @param status The status to filter products by (e.g., DESIGN, PROTOTYPE)
     * @return List of products matching the status (HTTP 200 OK), or HTTP 400 if status is invalid
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Product>> getProductsByStatus(@PathVariable String status) {
        logger.info("GET /api/products/status/{} - Fetching products by status", status);
        try {
            ProductStatus productStatus = ProductStatus.valueOf(status.toUpperCase());
            List<Product> products = productService.getProductsByStatus(productStatus);
            return ResponseEntity.ok(products);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid status: {}", status, e);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error fetching products by status {}: {}", status, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
