package com.retailflow.plm.controller;

import com.retailflow.plm.model.User;
import com.retailflow.plm.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller responsible for handling authentication-related endpoints.
 * 
 * <p>Exposes endpoints for user registration, login, and retrieval of the current authenticated user.
 * All requests are prefixed with /api/auth.</p>
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Allow all origins for development; restrict in production
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    /**
     * Registers a new user with username, email, password, and role.
     * 
     * @param registrationRequest a map containing "username", "email", "password", and optionally "role"
     * @return HTTP 201 if successful, 400 if registration fails
     */
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody Map<String, String> registrationRequest) {
        logger.info("POST /api/auth/register - Registering new user: {}", registrationRequest.get("username"));
        try {
            String username = registrationRequest.get("username");
            String email = registrationRequest.get("email");
            String password = registrationRequest.get("password");
            String roleName = registrationRequest.getOrDefault("role", "ROLE_USER"); // Default role: ROLE_USER

            userService.registerNewUser(username, email, password, roleName);
            return new ResponseEntity<>("User registered successfully!", HttpStatus.CREATED);
        } catch (RuntimeException e) {
            logger.error("Error registering user: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Authenticates a user using username and password.
     * 
     * <p>If authentication is successful, the user is stored in the Spring SecurityContext.</p>
     *
     * @param loginRequest a map containing "username" and "password"
     * @return HTTP 200 on success, 401 on failure
     */
    @PostMapping("/login")
    public ResponseEntity<String> authenticateUser(@RequestBody Map<String, String> loginRequest) {
        logger.info("POST /api/auth/login - Attempting login for user: {}", loginRequest.get("username"));
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.get("username"),
                            loginRequest.get("password")
                    )
            );

            // Set the authenticated user in the current security context
            SecurityContextHolder.getContext().setAuthentication(authentication);
            logger.info("User {} logged in successfully.", loginRequest.get("username"));
            return new ResponseEntity<>("User logged-in successfully!", HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Authentication failed for user {}: {}", loginRequest.get("username"), e.getMessage());
            return new ResponseEntity<>("Invalid username or password.", HttpStatus.UNAUTHORIZED);
        }
    }

    /**
     * Protected endpoint to return information about the currently authenticated user.
     * 
     * @return the username and authorities if authenticated, otherwise 401 Unauthorized
     */
    @GetMapping("/users/me")
    public ResponseEntity<String> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return ResponseEntity.ok("Authenticated user: " + authentication.getName() +
                    " with roles: " + authentication.getAuthorities());
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No authenticated user.");
    }
}
