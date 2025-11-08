package com.example.music_manager.requests.users

import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.validation.constraints.NotBlank

data class RefreshTokenRequest(
    @JsonProperty("refreshToken") @field:NotBlank
    val refreshToken: String,
)
