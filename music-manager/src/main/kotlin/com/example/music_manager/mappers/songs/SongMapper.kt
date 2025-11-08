package com.example.music_manager.mappers.songs

import com.example.music_manager.models.songs.Song
import com.example.music_manager.requests.songs.CreateSongRequest
import com.example.music_manager.requests.songs.UpdateSongRequest
import com.example.music_manager.responses.songs.SongResponse
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.MappingTarget
import org.mapstruct.NullValuePropertyMappingStrategy

@Mapper(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
interface SongMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "uploadedBy", source = "uploadedBy")
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "updatedAt", ignore = true)
    fun toSong(request: CreateSongRequest, uploadedBy: String): Song

    fun toSongResponse(song: Song): SongResponse

    fun updateSong(@MappingTarget song: Song, request: UpdateSongRequest)
}