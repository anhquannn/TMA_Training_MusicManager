package com.example.music_manager.requests.songs

import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.validation.constraints.NotBlank

data class CreateSongRequest (
    @JsonProperty("name") @field:NotBlank val name: String,
    @JsonProperty("genre") @field:NotBlank val genre: String,
    @JsonProperty("artist") @field:NotBlank val artist: String,
    @JsonProperty("fileUrl") val fileUrl: String? = null
)