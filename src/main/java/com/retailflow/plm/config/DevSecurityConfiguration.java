package com.retailflow.plm.config;

import com.retailflow.plm.security.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.Customizer;

/**
 * Security configuration for the 'dev' profile.
 * 
 * <p>This configuration relaxes some security constraints (e.g., disables CSRF, permits all requests)
 * to simplify local development and testing. It also sets up a basic HTTP authentication flow
 * for login, registration, and fetching user details.</p>
 */
@Configuration
@EnableWebSecurity // Enables Spring Security's web security support
@Profile("dev") // Activates this configuration only when 'dev' Spring profile is active
@Order(Ordered.HIGHEST_PRECEDENCE) // Ensures this config is applied first in the active profile
public class DevSecurityConfiguration {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Defines the SecurityFilterChain bean for the development environment.
     * 
     * <p>CSRF protection is disabled and basic authentication is enabled. Certain endpoints
     * are left open to facilitate local testing of authentication flows.</p>
     *
     * @param http the HttpSecurity configuration object
     * @return the configured SecurityFilterChain
     * @throws Exception in case of configuration error
     */
    @Bean
    public SecurityFilterChain devSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for development ease
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/api/auth/register", "/api/auth/login").permitAll() // Public endpoints
                .requestMatchers("/api/auth/users/me").authenticated() // Auth required for user info
                .anyRequest().permitAll() // All other endpoints are open for dev convenience
            )
            .httpBasic(Customizer.withDefaults()); // Enable HTTP Basic authentication for simplicity

        return http.build();
    }

    /**
     * Configures the DaoAuthenticationProvider for the 'dev' profile.
     * 
     * <p>Uses the custom UserDetailsService and password encoder to authenticate users.</p>
     *
     * @return a configured DaoAuthenticationProvider
     */
    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    /**
     * Exposes the AuthenticationManager bean required for programmatic authentication.
     * 
     * @param authenticationConfiguration the global AuthenticationConfiguration
     * @return the AuthenticationManager instance
     * @throws Exception in case of error during retrieval
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
