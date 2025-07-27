package com.retailflow.plm.controller;

import com.retailflow.plm.model.User;
import com.retailflow.plm.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// @CrossOrigin(origins = "*") // REMOVE THIS LINE
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        logger.info("Attempting to register user: {}", user.getUsername());
        try {
            userService.registerNewUser(user);
            logger.info("User {} registered successfully!", user.getUsername());
            return new ResponseEntity<>("User registered successfully!", HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            logger.warn("User registration failed for {}: {}", user.getUsername(), e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            logger.error("Error during user registration for {}: {}", user.getUsername(), e.getMessage(), e);
            return new ResponseEntity<>("User registration failed due to an unexpected error.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> authenticateUser(@RequestBody User loginUser) {
        logger.info("Attempting to authenticate user: {}", loginUser.getUsername());
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginUser.getUsername(), loginUser.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            logger.info("User {} logged-in successfully!", loginUser.getUsername());
            return new ResponseEntity<>("User logged-in successfully!", HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Authentication failed for user {}: {}", loginUser.getUsername(), e.getMessage());
            return new ResponseEntity<>("Invalid username or password.", HttpStatus.UNAUTHORIZED);
        }
    }

    @GetMapping("/users/me")
    public ResponseEntity<String> getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return new ResponseEntity<>("No authenticated user found.", HttpStatus.UNAUTHORIZED);
        }
        String username = authentication.getName();
        String roles = authentication.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .collect(java.util.stream.Collectors.joining(", "));
        logger.info("GET /api/auth/users/me - Authenticated user: {} with roles: [{}]", username, roles);
        return new ResponseEntity<>("Authenticated user: " + username + " with roles: [" + roles + "]", HttpStatus.OK);
    }
}
