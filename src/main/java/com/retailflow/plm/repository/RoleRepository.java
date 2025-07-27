package com.retailflow.plm.repository;

import com.retailflow.plm.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Repository interface for accessing and managing Role entities in the database.
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    /**
     * Finds a Role by its name (e.g., ROLE_ADMIN, ROLE_USER).
     *
     * @param name the name of the role
     * @return an Optional containing the Role if found, or empty if not found
     */
    Optional<Role> findByName(String name);
}
