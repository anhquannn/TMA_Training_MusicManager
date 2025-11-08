package com.example.music_manager.responses.users

data class UserProfileResponse(
    val id: String,
    val username: String,
    val email: String,
    val roles: Set<String>
)
