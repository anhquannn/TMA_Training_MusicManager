package com.example.music_manager.models.songs

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDateTime

@Document(collection = "song")
data class Song (
    @Id
    val id: String? = null,
    val name: String,
    val artist: String,
    val uploadedBy: String,
    val genre: String,
    val fileUrl: String,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime? = null
)