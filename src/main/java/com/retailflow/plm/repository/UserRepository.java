package com.retailflow.plm.repository;

import com.retailflow.plm.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Repository interface for accessing and managing User entities in the database.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Finds a User entity by username.
     *
     * @param username the username to search for
     * @return an Optional containing the User if found, or empty if not found
     */
    Optional<User> findByUsername(String username);

    /**
     * Checks if a User with the specified username exists.
     *
     * @param username the username to check
     * @return true if a user with the given username exists, false otherwise
     */
    Boolean existsByUsername(String username);

    /**
     * Checks if a User with the specified email exists.
     *
     * @param email the email to check
     * @return true if a user with the given email exists, false otherwise
     */
    Boolean existsByEmail(String email);
}
