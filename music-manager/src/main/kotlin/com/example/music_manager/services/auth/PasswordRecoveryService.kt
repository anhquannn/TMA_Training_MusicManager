package com.example.music_manager.services.auth

import com.example.music_manager.requests.users.ForgotPasswordRequest
import com.example.music_manager.requests.users.VerifyOtpRequest
import com.example.music_manager.requests.users.ResetPasswordRequest
import com.example.music_manager.responses.users.UserProfileResponse

interface PasswordRecoveryService {
    fun sendOtp(request: ForgotPasswordRequest)
    fun verifyOtp(request: VerifyOtpRequest)
    fun resetPassword(request: ResetPasswordRequest): UserProfileResponse
}
