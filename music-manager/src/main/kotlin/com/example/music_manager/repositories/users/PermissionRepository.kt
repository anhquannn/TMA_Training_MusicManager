package com.example.music_manager.repositories.users

import com.example.music_manager.models.users.Permission
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface PermissionRepository : MongoRepository<Permission, String> {
    fun findByName(name: String): Permission?
}
