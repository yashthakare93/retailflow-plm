package com.retailflow.plm.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Configuration class for application-wide beans.
 * This class is detected by Spring during component scanning and used
 * to define and provide reusable bean definitions.
 */
@Configuration
public class AppConfig {

    /**
     * Defines a {@link PasswordEncoder} bean using BCrypt hashing algorithm.
     * 
     * <p>
     * This encoder is used throughout the application for encoding and verifying
     * user passwords securely. BCrypt provides strong hashing with built-in salt.
     * </p>
     *
     * @return a BCryptPasswordEncoder instance
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
