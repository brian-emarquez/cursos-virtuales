package com.cursosvirtuales.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// Permite que un frontend (Angular, React, Vue) consuma este backend
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                        "http://localhost:4200",  // Angular
                        "http://localhost:5173",  // Vite (React/Vue)
                        "http://localhost:3000"   // React (CRA) / Next
                )
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE");
    }
}