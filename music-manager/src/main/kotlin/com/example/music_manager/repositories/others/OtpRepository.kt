package com.example.music_manager.repositories.others

import com.example.music_manager.models.others.OtpToken
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
interface OtpRepository : MongoRepository<OtpToken, String> {
    
    fun findByUserIdAndOtpCode(userId: String, otpCode: String): OtpToken?
    
    fun findByUserIdAndExpiresAtBefore(userId: String, expiresAt: LocalDateTime): List<OtpToken>
    
    fun deleteByUserIdAndExpiresAtBefore(userId: String, expiresAt: LocalDateTime)
    
    fun deleteByUserId(userId: String)
}
