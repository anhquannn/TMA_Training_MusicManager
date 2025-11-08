package com.example.music_manager.repositories.songs

import com.example.music_manager.models.songs.Song
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface SongRepository : MongoRepository<Song, String> {
    fun findByUploadedBy(userId: String): List<Song>
    fun findByUploadedBy(userId: String, pageable: org.springframework.data.domain.Pageable): org.springframework.data.domain.Page<Song>
    fun findByUploadedByAndNameContainingIgnoreCase(userId: String, name: String): List<Song>
    fun findByNameContainingIgnoreCase(name: String): List<Song>
}