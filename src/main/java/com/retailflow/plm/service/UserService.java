package com.retailflow.plm.service;

import com.retailflow.plm.model.Role;
import com.retailflow.plm.model.User;
import com.retailflow.plm.repository.RoleRepository;
import com.retailflow.plm.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Injected PasswordEncoder

    public User registerNewUser(User user) {
        logger.info("Attempting to register new user: {}", user.getUsername());

        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username already exists: " + user.getUsername());
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + user.getEmail());
        }

        // Encode the raw password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Assign roles based on the 'role' field in the incoming User object
        Set<Role> userRoles = new HashSet<>();
        if (user.getRoles() != null && !user.getRoles().isEmpty()) {
            // Assume the user object comes with role names (e.g., "ROLE_DESIGNER")
            for (Role requestedRole : user.getRoles()) {
                Optional<Role> existingRole = roleRepository.findByName(requestedRole.getName());
                if (existingRole.isPresent()) {
                    userRoles.add(existingRole.get());
                } else {
                    // Handle case where requested role doesn't exist, e.g., create it or throw error
                    logger.warn("Requested role {} does not exist. Assigning default ROLE_USER.", requestedRole.getName());
                    userRoles.add(roleRepository.findByName("ROLE_USER")
                                  .orElseThrow(() -> new IllegalStateException("Default ROLE_USER not found!")));
                }
            }
        } else {
            // Default to ROLE_USER if no roles are specified in the request
            userRoles.add(roleRepository.findByName("ROLE_USER")
                          .orElseThrow(() -> new IllegalStateException("Default ROLE_USER not found!")));
        }
        user.setRoles(userRoles); // Set the managed roles on the user object

        User savedUser = userRepository.save(user);
        logger.info("User {} registered successfully with roles: {}", savedUser.getUsername(), savedUser.getRoles());
        return savedUser;
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
