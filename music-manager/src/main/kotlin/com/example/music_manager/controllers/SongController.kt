package com.example.music_manager.controllers

import com.example.music_manager.requests.songs.CreateSongRequest
import com.example.music_manager.requests.songs.UpdateSongRequest
import com.example.music_manager.responses.songs.SongResponse
import com.example.music_manager.responses.others.ApiResponse
import com.example.music_manager.responses.others.PagedResponse
import com.example.music_manager.services.songs.SongService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody
import java.io.File
import java.nio.file.Files

@RestController
@RequestMapping("/songs")
@Tag(name = "Songs")
class SongController(
    private val songService: SongService
) {

    @PostMapping(consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    @Operation(summary = "Upload and create a song")
    fun uploadSong(
        @RequestPart("info") infoJson: String,
        @RequestPart("file") file: MultipartFile
    ): ApiResponse<SongResponse> =
        ApiResponse.success(songService.createFromMultipart(infoJson, file), "Song created")

    @PutMapping("/{id}")
    fun updateSong(@PathVariable id: String, @RequestBody request: UpdateSongRequest): ApiResponse<SongResponse> =
        ApiResponse.success(songService.update(id, request), "Song updated")

    @DeleteMapping("/{id}")
    fun deleteSong(@PathVariable id: String): ApiResponse<Void> {
        songService.delete(id)
        return ApiResponse.success(message = "Song deleted")
    }

    @GetMapping("/{id}")
    fun getSong(@PathVariable id: String): ApiResponse<SongResponse> = ApiResponse.success(songService.getById(id))

    @GetMapping("/search")
    fun searchSong(@RequestParam keyword: String?): ApiResponse<List<SongResponse>> =
        ApiResponse.success(songService.search(keyword))

    @GetMapping("/page")
    @Operation(summary = "Get paginated songs")
    fun paged(
        @RequestParam(defaultValue = "0") page: Int, 
        @RequestParam(defaultValue = "10") size: Int
    ): ApiResponse<PagedResponse<SongResponse>> =
        ApiResponse.success(songService.getPaged(page, size))

    @GetMapping("/{id}/play")
    fun play(@PathVariable id: String): ResponseEntity<StreamingResponseBody> = songService.play(id)
}
