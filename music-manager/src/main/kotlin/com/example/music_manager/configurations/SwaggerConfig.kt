package com.example.music_manager.configurations

import io.swagger.v3.oas.models.Components
import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.info.Info
import io.swagger.v3.oas.models.security.SecurityRequirement
import io.swagger.v3.oas.models.security.SecurityScheme
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class SwaggerConfig {

    @Bean
    fun customOpenAPI(): OpenAPI {
        val securitySchemeName = "bearerAuth"
        val securityScheme = SecurityScheme()
            .type(SecurityScheme.Type.HTTP)
            .scheme("bearer")
            .bearerFormat("JWT")
            .description("Enter your JWT access token in the format: Bearer <token>")

        return OpenAPI()
            .info(
                Info()
                    .title("Music Manager API")
                    .version("v1")
                    .description("API documentation for Music Manager")
            )
            .components(
                Components().addSecuritySchemes(securitySchemeName, securityScheme)
            )
            // Apply security globally so all endpoints (except permitAll) require bearer
            .addSecurityItem(SecurityRequirement().addList(securitySchemeName))
    }
}