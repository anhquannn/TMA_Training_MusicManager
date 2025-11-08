package com.example.music_manager.requests.users

import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

data class LoginRequest(
    @JsonProperty("email") @field:Email @NotBlank val email: String,
    @JsonProperty("password") @field:NotBlank val password: String
)
