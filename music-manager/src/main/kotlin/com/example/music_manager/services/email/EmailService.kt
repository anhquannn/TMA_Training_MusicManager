package com.example.music_manager.services.email

import com.example.music_manager.exceptions.AppException
import com.example.music_manager.exceptions.ErrorCode
import com.example.music_manager.models.others.OtpToken
import com.example.music_manager.repositories.others.OtpRepository
import jakarta.mail.MessagingException
import jakarta.mail.internet.MimeMessage
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service
import java.security.SecureRandom
import java.time.LocalDateTime
import java.util.concurrent.CompletableFuture
import java.util.concurrent.ConcurrentHashMap

@Service
class EmailService(
    private val mailSender: JavaMailSender,
    private val otpRepository: OtpRepository
) {
    
    companion object {
        private val logger = LoggerFactory.getLogger(EmailService::class.java)
        private const val OTP_VALIDITY_MINUTES = 10L
    }
    
    @Value("\${spring.mail.username}")
    private lateinit var fromEmail: String
    
    // In-memory store for temporary passwords (production should use Redis)
    private val passwordStore = ConcurrentHashMap<String, String>()

    @Async
    fun sendEmailAsync(to: String, subject: String, body: String): CompletableFuture<Void> {
        return try {
            sendEmail(to, subject, body)
            CompletableFuture.completedFuture(null)
        } catch (e: Exception) {
            logger.error("Failed to send email to $to", e)
            CompletableFuture.failedFuture(e)
        }
    }

    fun sendEmail(to: String, subject: String, body: String) {
        try {
            val message: MimeMessage = mailSender.createMimeMessage()
            val helper = MimeMessageHelper(message, true)
            
            helper.setFrom(fromEmail)
            helper.setTo(to)
            helper.setSubject(subject)
            helper.setText(body, true) // true for HTML content
            
            mailSender.send(message)
            logger.info("Email sent successfully to $to")
        } catch (e: MessagingException) {
            logger.error("Failed to send email to $to", e)
            throw AppException(ErrorCode.EMAIL_SEND_FAILED)
        }
    }

    fun generateAndSendOtp(email: String, userId: String): String {
        // Clean up expired OTPs for this user
        cleanupExpiredOtps(userId)
        
        val otp = generateOtp()
        val expiryTime = LocalDateTime.now().plusMinutes(OTP_VALIDITY_MINUTES)
        
        // Save OTP to database
        val otpToken = OtpToken(
            userId = userId,
            otpCode = otp,
            expiresAt = expiryTime
        )
        otpRepository.save(otpToken)
        
        // Send email
        val subject = "Mã OTP xác thực - Music Manager"
        val body = buildOtpEmailBody(otp, OTP_VALIDITY_MINUTES)
        
        sendEmailAsync(email, subject, body)
        
        logger.info("OTP generated and sent to $email for user $userId")
        return otp
    }

    fun validateOtp(userId: String, otpCode: String): Boolean {
        val otpToken = otpRepository.findByUserIdAndOtpCode(userId, otpCode.trim())
            ?: throw AppException(ErrorCode.INVALID_OTP)
        
        if (otpToken.expiresAt.isBefore(LocalDateTime.now())) {
            otpRepository.delete(otpToken)
            throw AppException(ErrorCode.INVALID_OTP)
        }
        
        // OTP is valid, remove it from database
        otpRepository.delete(otpToken)
        logger.info("OTP validated successfully for user $userId")
        return true
    }

    fun generateAndSendTemporaryPassword(email: String): String {
        val tempPassword = generateRandomPassword()
        
        val subject = "Mật khẩu tạm thời - Music Manager"
        val body = buildPasswordEmailBody(tempPassword)
        
        sendEmailAsync(email, subject, body)
        
        // Store temporarily (in production, use Redis with TTL)
        passwordStore[email] = tempPassword
        
        logger.info("Temporary password generated and sent to $email")
        return tempPassword
    }

    fun validateTemporaryPassword(email: String, password: String): Boolean {
        val storedPassword = passwordStore[email]
        if (storedPassword != null && storedPassword == password) {
            passwordStore.remove(email)
            return true
        }
        return false
    }

    fun sendWelcomeEmail(email: String, username: String) {
        val subject = "Chào mừng đến với Music Manager!"
        val body = buildWelcomeEmailBody(username)
        
        sendEmailAsync(email, subject, body)
        logger.info("Welcome email sent to $email")
    }

    fun sendPasswordResetConfirmation(email: String, username: String) {
        val subject = "Mật khẩu đã được đặt lại thành công"
        val body = buildPasswordResetConfirmationBody(username)
        
        sendEmailAsync(email, subject, body)
        logger.info("Password reset confirmation sent to $email")
    }
    
    // Private helper methods
    
    private fun generateOtp(): String {
        val secureRandom = SecureRandom()
        return (100000 + secureRandom.nextInt(900000)).toString()
    }
    
    private fun generateRandomPassword(): String {
        val chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        val secureRandom = SecureRandom()
        return (1..12)
            .map { chars[secureRandom.nextInt(chars.length)] }
            .joinToString("")
    }
    
    private fun cleanupExpiredOtps(userId: String) {
        val expiredOtps = otpRepository.findByUserIdAndExpiresAtBefore(userId, LocalDateTime.now())
        if (expiredOtps.isNotEmpty()) {
            otpRepository.deleteAll(expiredOtps)
            logger.info("Cleaned up ${expiredOtps.size} expired OTPs for user $userId")
        }
    }
    
    private fun buildOtpEmailBody(otp: String, validityMinutes: Long): String {
        return """
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2563eb;">Music Manager - Mã OTP xác thực</h2>
                    <p>Xin chào,</p>
                    <p>Bạn đã yêu cầu mã OTP để xác thực tài khoản. Mã OTP của bạn là:</p>
                    <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
                        <h1 style="color: #2563eb; font-size: 32px; margin: 0; letter-spacing: 5px;">$otp</h1>
                    </div>
                    <p><strong>Lưu ý quan trọng:</strong></p>
                    <ul>
                        <li>Mã OTP này có hiệu lực trong <strong>$validityMinutes phút</strong></li>
                        <li>Không chia sẻ mã này với bất kỳ ai</li>
                        <li>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này</li>
                    </ul>
                    <p>Trân trọng,<br>Đội ngũ Music Manager</p>
                    <hr style="margin-top: 30px; border: none; border-top: 1px solid #e5e7eb;">
                    <p style="font-size: 12px; color: #6b7280;">
                        Email này được gửi tự động, vui lòng không trả lời.
                    </p>
                </div>
            </body>
            </html>
        """.trimIndent()
    }
    
    private fun buildPasswordEmailBody(tempPassword: String): String {
        return """
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2563eb;">Music Manager - Mật khẩu tạm thời</h2>
                    <p>Xin chào,</p>
                    <p>Mật khẩu tạm thời của bạn đã được tạo thành công:</p>
                    <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
                        <h3 style="color: #2563eb; margin: 0; font-family: monospace;">$tempPassword</h3>
                    </div>
                    <p><strong>Hướng dẫn sử dụng:</strong></p>
                    <ol>
                        <li>Sử dụng mật khẩu này để đăng nhập vào tài khoản</li>
                        <li>Sau khi đăng nhập, vui lòng đổi mật khẩu mới ngay lập tức</li>
                        <li>Mật khẩu tạm thời này sẽ hết hiệu lực sau 24 giờ</li>
                    </ol>
                    <p>Trân trọng,<br>Đội ngũ Music Manager</p>
                </div>
            </body>
            </html>
        """.trimIndent()
    }
    
    private fun buildWelcomeEmailBody(username: String): String {
        return """
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2563eb;">Chào mừng đến với Music Manager!</h2>
                    <p>Xin chào <strong>$username</strong>,</p>
                    <p>Chúc mừng bạn đã đăng ký thành công tài khoản Music Manager!</p>
                    <p>Bây giờ bạn có thể:</p>
                    <ul>
                        <li>Tải lên và quản lý bộ sưu tập nhạc của mình</li>
                        <li>Tạo playlist cá nhân</li>
                        <li>Chia sẻ nhạc với bạn bè</li>
                        <li>Khám phá những bài hát mới</li>
                    </ul>
                    <p>Hãy bắt đầu hành trình âm nhạc của bạn ngay hôm nay!</p>
                    <p>Trân trọng,<br>Đội ngũ Music Manager</p>
                </div>
            </body>
            </html>
        """.trimIndent()
    }
    
    private fun buildPasswordResetConfirmationBody(username: String): String {
        return """
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2563eb;">Mật khẩu đã được đặt lại thành công</h2>
                    <p>Xin chào <strong>$username</strong>,</p>
                    <p>Mật khẩu tài khoản Music Manager của bạn đã được đặt lại thành công.</p>
                    <p>Nếu bạn không thực hiện hành động này, vui lòng liên hệ với chúng tôi ngay lập tức.</p>
                    <p>Trân trọng,<br>Đội ngũ Music Manager</p>
                </div>
            </body>
            </html>
        """.trimIndent()
    }
}
