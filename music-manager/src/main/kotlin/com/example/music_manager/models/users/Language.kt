package com.example.music_manager.models.users

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "languages")
data class Language (
    @Id
    val id: String? = null,
    val code: String,
    val displayName: String
)