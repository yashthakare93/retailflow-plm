package com.retailflow.plm.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration // Marks this class as a source of bean definitions for Spring
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Apply CORS to all API endpoints
                .allowedOrigins("http://localhost:5173", "http://127.0.0.1:5173") // Allow requests from your React dev server
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allow these HTTP methods
                .allowedHeaders("*") // Allow all headers
                .allowCredentials(true) // Allow credentials (e.g., cookies, HTTP authentication headers)
                .maxAge(3600); // Max age of preflight request cache
    }
}
