package com.example.music_manager.requests.songs

import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.validation.constraints.Size

data class UpdateSongRequest (
    @JsonProperty("name") @field:Size(max = 100) val name: String?,
    @JsonProperty("artist") val artist: String?,
    @JsonProperty("genre") val genre: String?,
    @JsonProperty("fileUrl") val fileUrl: String?
)