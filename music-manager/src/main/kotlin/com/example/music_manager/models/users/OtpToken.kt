package com.example.music_manager.models.users

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDateTime

@Document(collection = "otp_tokens")
data class OtpToken(
    @Id val id: String? = null,
    val userId: String,
    val otpCode: String,
    val expiresAt: LocalDateTime,
    val verified: Boolean = false
)
