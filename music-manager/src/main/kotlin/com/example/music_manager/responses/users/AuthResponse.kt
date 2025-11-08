package com.example.music_manager.responses.users

data class AuthResponse(
    val accessToken: String,
    val refreshToken: String? = null,
    val tokenType: String = "Bearer",
    val expiresIn: Long = 3600
)
