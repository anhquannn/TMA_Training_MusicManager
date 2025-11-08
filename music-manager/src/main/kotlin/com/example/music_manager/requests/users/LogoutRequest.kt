package com.example.music_manager.requests.users

import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.validation.constraints.NotBlank

data class LogoutRequest(
    @JsonProperty("token") @field:NotBlank
    val token: String,
)
