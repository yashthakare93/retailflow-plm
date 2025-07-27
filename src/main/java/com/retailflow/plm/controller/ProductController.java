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

// @CrossOrigin(origins = "*") // REMOVE THIS LINE
@RestController
@RequestMapping("/api/products")
public class ProductController {
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);
    
    @Autowired
    private ProductService productService;
    
    /**
     * GET /api/products - Retrieves all products.
     * @return A list of all products with HTTP status 200 OK.
     */
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        logger.info("GET /api/products - Fetching all products");
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }
    
    /**
     * GET /api/products/{id} - Retrieves a product by its database ID.
     * @param id The ID of the product.
     * @return The product with HTTP status 200 OK, or 404 Not Found if not found.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        logger.info("GET /api/products/{} - Fetching product by ID", id);
        Optional<Product> product = productService.getProductById(id);
        return product.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * POST /api/products - Creates a new product.
     * @param product The Product object to create (sent in the request body).
     * @return The created product with HTTP status 201 Created, or 400 Bad Request on error.
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
     * PUT /api/products/{id}/status - Updates the status of an existing product.
     * @param id The ID of the product to update.
     * @param statusUpdate A map containing the new status (e.g., {"status": "PROTOTYPE"}).
     * @return The updated product with HTTP status 200 OK, or 404 Not Found if product doesn't exist,
     * or 400 Bad Request if the status value is invalid.
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<Product> updateProductStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, String> statusUpdate) {
        logger.info("PUT /api/products/{}/status - Updating product status", id);
        try {
            // Convert string status from request to ProductStatus enum
            ProductStatus newStatus = ProductStatus.valueOf(statusUpdate.get("status").toUpperCase());
            Optional<Product> updatedProduct = productService.updateProductStatus(id, newStatus);
            return updatedProduct.map(ResponseEntity::ok)
                                .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            // Catches error if ProductStatus.valueOf() fails (invalid status string)
            logger.error("Invalid product status provided: {}", statusUpdate.get("status"), e);
            return ResponseEntity.badRequest().body(null); // Or return a more descriptive error object
        } catch (Exception e) {
            logger.error("Error updating product status for ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * GET /api/products/status/{status} - Retrieves products filtered by status.
     * @param status The status string (e.g., "DESIGN") to filter products by.
     * @return A list of products matching the status with HTTP status 200 OK, or 400 Bad Request if status is invalid.
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Product>> getProductsByStatus(@PathVariable String status) {
        logger.info("GET /api/products/status/{} - Fetching products by status", status);
        try {
            ProductStatus productStatus = ProductStatus.valueOf(status.toUpperCase());
            List<Product> products = productService.getProductsByStatus(productStatus);
            return ResponseEntity.ok(products);
        } catch (IllegalArgumentException e) {
            // Catches error if ProductStatus.valueOf() fails (invalid status string)
            logger.error("Invalid status: {}", status, e);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error fetching products by status {}: {}", status, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
