package com.example.music_manager.models.users

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "roles")
data class Role (
    @Id
    val id: String? = null,
    val name: String,
    val permissions: Set<String> = emptySet()
)