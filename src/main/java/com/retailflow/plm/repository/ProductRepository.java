package com.retailflow.plm.repository;

import com.retailflow.plm.model.Product;
import com.retailflow.plm.model.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Custom query to find a product by its unique business product_id
    Optional<Product> findByProductId(String productId);

    // Custom query to find all products by their status
    List<Product> findByStatus(ProductStatus status);

    // Custom query to find all products by their category
    List<Product> findByCategory(String category);
    
    // Custom query to search products by name or description (case-insensitive)
    @Query("SELECT p FROM Product p WHERE p.name ILIKE %?1% OR p.description ILIKE %?1%")
    List<Product> searchByNameOrDescription(String searchTerm);
}
