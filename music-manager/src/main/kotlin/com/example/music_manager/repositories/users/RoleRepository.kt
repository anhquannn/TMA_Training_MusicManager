package com.example.music_manager.repositories.users

import com.example.music_manager.models.users.Role
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface RoleRepository : MongoRepository<Role, String> {
    fun findByName(name: String): Role?
}
