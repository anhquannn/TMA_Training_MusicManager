package com.example.music_manager.repositories.users

import com.example.music_manager.models.users.OtpToken
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface OtpTokenRepository : MongoRepository<OtpToken, String> {
    fun findByUserIdAndOtpCode(userId: String, otpCode: String): OtpToken?
}
