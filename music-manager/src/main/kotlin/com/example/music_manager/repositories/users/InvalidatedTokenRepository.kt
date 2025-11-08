package com.example.music_manager.repositories.users

import com.example.music_manager.models.users.InvalidatedToken
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface InvalidatedTokenRepository : MongoRepository<InvalidatedToken, String>
