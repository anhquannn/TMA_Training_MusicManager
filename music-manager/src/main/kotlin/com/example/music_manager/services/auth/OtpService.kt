package com.example.music_manager.services.auth

import com.example.music_manager.exceptions.AppException
import com.example.music_manager.exceptions.ErrorCode
import com.example.music_manager.repositories.users.UserRepository
import com.example.music_manager.requests.users.ForgotPasswordRequest
import com.example.music_manager.requests.users.VerifyOtpRequest
import com.example.music_manager.requests.users.ResetPasswordRequest
import com.example.music_manager.responses.users.UserProfileResponse
import com.example.music_manager.mappers.users.UserMapper
import com.example.music_manager.services.email.EmailService
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class OtpService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val userMapper: UserMapper,
    private val emailService: EmailService,
) : PasswordRecoveryService {

    override fun sendOtp(request: ForgotPasswordRequest) {
        val user = userRepository.findByEmail(request.email) ?: throw AppException(ErrorCode.USER_NOT_EXISTED)
        emailService.generateAndSendOtp(user.email, user.id!!)
    }

    override fun verifyOtp(request: VerifyOtpRequest) {
        val user = userRepository.findByEmail(request.email) ?: throw AppException(ErrorCode.USER_NOT_EXISTED)
        val valid = emailService.validateOtp(user.id!!, request.otpCode)
        if (!valid) throw AppException(ErrorCode.INVALID_OTP)
    }

    override fun resetPassword(request: ResetPasswordRequest): UserProfileResponse {
        if (request.newPassword != request.confirmPassword) throw AppException(ErrorCode.USER_INVALID)
        val user = userRepository.findByEmail(request.email) ?: throw AppException(ErrorCode.USER_NOT_EXISTED)
        val valid = emailService.validateOtp(user.id!!, request.otpCode)
        if (!valid) throw AppException(ErrorCode.INVALID_OTP)
        val updated = user.copy(password = passwordEncoder.encode(request.newPassword))
        return userMapper.toUserResponse(userRepository.save(updated))
    }
}
