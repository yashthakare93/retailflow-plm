package com.retailflow.plm.config;

import com.retailflow.plm.security.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.Customizer;

/**
 * Security configuration for non-development environments (e.g., staging, production).
 * 
 * <p>This setup disables CSRF protection, configures stateless session management,
 * and applies basic authentication with method-level security enabled.</p>
 */
@Configuration
@EnableWebSecurity // Enables Spring Security’s web security features
@EnableMethodSecurity(prePostEnabled = true) // Allows usage of method-level annotations like @PreAuthorize
@Profile("!dev") // This config is active for all profiles except 'dev'
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    /**
     * Provides an AuthenticationManager bean, allowing custom authentication
     * through Spring's security context.
     *
     * @param configuration injected AuthenticationConfiguration
     * @return configured AuthenticationManager
     * @throws Exception if unable to retrieve AuthenticationManager
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    /**
     * Configures the security filter chain for handling HTTP requests in a stateless manner.
     * 
     * <p>Key Features:</p>
     * <ul>
     *   <li>Disables CSRF (suitable for stateless REST APIs)</li>
     *   <li>Allows public access to auth endpoints (e.g., login, register)</li>
     *   <li>Permits public access to product-related endpoints</li>
     *   <li>Requires authentication for all other routes</li>
     *   <li>Enables HTTP Basic Authentication</li>
     *   <li>Sets session policy to stateless (no HTTP session stored)</li>
     * </ul>
     *
     * @param http the HttpSecurity builder
     * @return configured SecurityFilterChain
     * @throws Exception if building the chain fails
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF (REST APIs are usually stateless)
            .authorizeHttpRequests(authorize -> {
                authorize.requestMatchers("/api/auth/**").permitAll(); // Public auth endpoints
                authorize.requestMatchers("/api/products/**").permitAll(); // Public product endpoints (temporary)
                authorize.anyRequest().authenticated(); // All other routes require authentication
            })
            .httpBasic(Customizer.withDefaults()); // Enable basic HTTP authentication

        // Enforce stateless session management (no server-side sessions)
        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }
}
