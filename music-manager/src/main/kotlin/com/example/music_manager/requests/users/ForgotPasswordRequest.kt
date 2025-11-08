package com.example.music_manager.requests.users

import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

data class ForgotPasswordRequest(
    @JsonProperty("email") @field:Email @NotBlank val email: String
)
