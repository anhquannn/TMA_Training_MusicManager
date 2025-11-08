package com.example.music_manager.requests.users

import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class RegisterRequest(
    @JsonProperty("email") @field:Email @NotBlank val email: String,
    @JsonProperty("password") @field:Size(min = 6, max = 30) val password: String,
    @JsonProperty("username") @field:Size(min = 2, max = 50) val username: String,
    @JsonProperty("confirmPassword") val confirmPassword: String
)
