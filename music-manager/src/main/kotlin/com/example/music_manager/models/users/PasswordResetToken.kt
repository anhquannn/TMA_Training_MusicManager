package com.example.music_manager.models.users

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDateTime

@Document(collection = "password_reset_tokens")
data class PasswordResetToken(
    @Id val id: String? = null,
    val userId: String,
    val token: String,
    val expiresAt: LocalDateTime
)
