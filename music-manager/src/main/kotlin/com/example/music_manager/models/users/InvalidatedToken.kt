package com.example.music_manager.models.users

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDateTime

@Document(collection = "invalidated_tokens")
data class InvalidatedToken(
    @Id
    val invalidatedTokenId: String,
    val expiryTime: LocalDateTime,
)
