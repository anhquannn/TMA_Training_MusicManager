package com.example.music_manager.services.songs

import com.example.music_manager.exceptions.AppException
import com.example.music_manager.exceptions.ErrorCode
import com.example.music_manager.mappers.songs.SongMapper
import com.example.music_manager.models.songs.Song
import com.example.music_manager.repositories.songs.SongRepository
import com.example.music_manager.requests.songs.CreateSongRequest
import com.example.music_manager.requests.songs.UpdateSongRequest
import com.example.music_manager.responses.songs.SongResponse
import com.example.music_manager.responses.others.PagedResponse
import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.validation.Validator
import org.springframework.beans.factory.annotation.Value
import org.springframework.cache.annotation.CacheEvict
import org.springframework.cache.annotation.Cacheable
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody
import java.io.File
import java.time.LocalDateTime
import java.util.*

@Service
@Transactional
class SongServiceImpl(
    private val songRepository: SongRepository,
    private val songMapper: SongMapper,
    private val objectMapper: ObjectMapper,
    private val validator: Validator,
    @Value("\${file.upload-dir}") private val uploadDir: String,
): SongService {

//    @CacheEvict(value = ["songs_v2"], allEntries = true)
    override fun create(request: CreateSongRequest): SongResponse {
        val currentUserId = getCurrentUserId()
        val song = songMapper.toSong(request, currentUserId)
        return songMapper.toSongResponse(songRepository.save(song))
    }

//    @CacheEvict(value = ["songs_v2"], allEntries = true)
    override fun createFromMultipart(infoJson: String, file: MultipartFile): SongResponse {
        try {
            val info = objectMapper.readValue(infoJson, CreateSongRequest::class.java)

            val violations = validator.validate(info)
            if (violations.isNotEmpty()) {
                val errorMessage = violations.joinToString(", ") { "${it.propertyPath}: ${it.message}" }
                throw AppException(ErrorCode.USER_INVALID)
            }

            val fileUrl = storeFile(file)
            val requestWithUrl = info.copy(fileUrl = fileUrl)
            return create(requestWithUrl)
            
        } catch (e: AppException) {
            throw e
        } catch (e: Exception) {
            e.printStackTrace()
            throw AppException(ErrorCode.USER_INVALID)
        }
    }

//    @CacheEvict(value = ["songs_v2"], allEntries = true)
    override fun update(id: String, request: UpdateSongRequest): SongResponse {
        val song = getOwnedSong(id)
        val updated = song.copy(
            name = request.name ?: song.name,
            artist = request.artist ?: song.artist,
            genre = request.genre ?: song.genre,
            fileUrl = request.fileUrl ?: song.fileUrl,
            updatedAt = LocalDateTime.now()
        )
        return songMapper.toSongResponse(songRepository.save(updated))
    }

//    @CacheEvict(value = ["songs_v2"], allEntries = true)
    override fun delete(id: String) {
        val song = getOwnedSong(id)
        songRepository.delete(song)
    }

    override fun getById(id: String): SongResponse {
        val song = getOwnedSong(id)
        return songMapper.toSongResponse(song)
    }

    override fun search(name: String?): List<SongResponse> {
        val currentUserId = getCurrentUserId()
        val songs = if (name.isNullOrBlank()) {
            songRepository.findByUploadedBy(currentUserId)
        } else {
            songRepository.findByUploadedByAndNameContainingIgnoreCase(currentUserId, name)
        }
        return songs.map(songMapper::toSongResponse)
    }

//    @Cacheable(
//        value = ["songs_v2"],
//        key = "#page + '-' + #size + '-' + T(org.springframework.security.core.context.SecurityContextHolder).getContext().authentication?.name"
//    )
    override fun getPaged(page: Int, size: Int): PagedResponse<SongResponse> {
        val currentUserId = getCurrentUserId()
        val pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))
        val pageResult = songRepository.findByUploadedBy(currentUserId, pageable)
        val songResponses = pageResult.content.map(songMapper::toSongResponse)
        
        return PagedResponse.of(
            content = songResponses,
            page = page,
            size = size,
            totalElements = pageResult.totalElements
        )
    }

    override fun storeFile(file: MultipartFile): String {
        if (file.isEmpty) throw AppException(ErrorCode.INVALID_FILE)
        val ext = file.originalFilename?.substringAfterLast('.', "") ?: ""

        if (ext.lowercase(Locale.getDefault()) !in setOf("mp3", "mp4")) {
            throw AppException(ErrorCode.INVALID_FILE)
        }
        val destDir = File(uploadDir).absoluteFile

        if (!destDir.exists()) destDir.mkdirs()
        val filename = "${UUID.randomUUID()}.$ext"
        val dest = File(destDir, filename)

        file.transferTo(dest.toPath())
        return "/music/api/v1/files/$filename"
    }

    private fun getOwnedSong(id: String): Song {
        val currentUserId = getCurrentUserId()
        val song = songRepository.findById(id).orElseThrow { AppException(ErrorCode.SONG_NOT_FOUND) }
        if (song.uploadedBy != currentUserId) throw AppException(ErrorCode.ACCESS_DENIED)
        return song
    }

    override fun play(id: String): ResponseEntity<StreamingResponseBody> {
        val song = songRepository.findById(id).orElseThrow { AppException(ErrorCode.SONG_NOT_FOUND) }
        
        val filename = song.fileUrl.substringAfterLast("/")
        val file = File(uploadDir, filename)
        if (!file.exists()) {
            throw AppException(ErrorCode.SONG_NOT_FOUND)
        }
        
        val body = StreamingResponseBody { out -> java.nio.file.Files.copy(file.toPath(), out) }
        val mediaType = if (song.fileUrl.endsWith("mp3")) org.springframework.http.MediaType.parseMediaType("audio/mpeg") else org.springframework.http.MediaType.parseMediaType("video/mp4")
        return ResponseEntity.ok().contentType(mediaType).body(body)
    }

    private fun getCurrentUserId(): String {
        val auth = SecurityContextHolder.getContext().authentication
        return auth?.name ?: "anonymous-user"
    }
}
