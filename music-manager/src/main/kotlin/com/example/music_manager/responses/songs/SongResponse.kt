package com.example.music_manager.responses.songs

import java.time.LocalDateTime

data class SongResponse (
    val id: String,
    val name: String,
    val artist: String,
    val genre: String,
    val fileUrl: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime?
    )