package com.example.music_manager.services.songs

import com.example.music_manager.requests.songs.CreateSongRequest
import com.example.music_manager.requests.songs.UpdateSongRequest
import com.example.music_manager.responses.songs.SongResponse
import com.example.music_manager.responses.others.PagedResponse
import org.springframework.web.multipart.MultipartFile

interface SongService {
    fun create(request: CreateSongRequest): SongResponse
    fun createFromMultipart(infoJson: String, file: MultipartFile): SongResponse
    fun update(id: String, request: UpdateSongRequest): SongResponse
    fun delete(id: String)
    fun getById(id: String): SongResponse
    fun search(name: String?): List<SongResponse>
    fun getPaged(page: Int, size: Int): PagedResponse<SongResponse>
    fun play(id: String): org.springframework.http.ResponseEntity<org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody>
    fun storeFile(file: MultipartFile): String
}