package com.example.music_manager.controllers

import com.example.music_manager.requests.users.*
import com.example.music_manager.requests.users.ForgotPasswordRequest
import com.example.music_manager.requests.users.VerifyOtpRequest
import com.example.music_manager.requests.users.ResetPasswordRequest
import com.example.music_manager.responses.others.ApiResponse
import com.example.music_manager.responses.users.AuthResponse
import com.example.music_manager.responses.users.UserProfileResponse
import com.example.music_manager.services.auth.AuthService
import com.example.music_manager.services.auth.PasswordRecoveryService
import com.example.music_manager.services.users.UserService
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication")
class AuthController(
    private val userService: UserService,
    private val authService: AuthService,
    private val passwordService: PasswordRecoveryService
) {

    @PostMapping("/register")
    fun register(@RequestBody @Valid request: RegisterRequest): ApiResponse<UserProfileResponse> =
        ApiResponse.success(userService.register(request), "User registered")

    @PostMapping("/forgot-password")
    fun forgotPassword(@RequestBody @Valid request: ForgotPasswordRequest): ApiResponse<Void> {
        passwordService.sendOtp(request)
        return ApiResponse.success(message = "OTP sent")
    }

    @PostMapping("/verify-otp")
    fun verifyOtp(@RequestBody @Valid request: VerifyOtpRequest): ApiResponse<Void> {
        passwordService.verifyOtp(request)
        return ApiResponse.success(message = "OTP verified")
    }

    @PostMapping("/reset-password")
    fun resetPassword(@RequestBody @Valid request: ResetPasswordRequest): ApiResponse<UserProfileResponse> =
        ApiResponse.success(passwordService.resetPassword(request), "Password updated")

    @PostMapping("/login")
    fun login(@RequestBody @Valid request: LoginRequest): ApiResponse<AuthResponse> =
        ApiResponse.success(authService.login(request.email, request.password), "Login successful")

    @PostMapping("/refresh")
    fun refresh(@RequestBody @Valid request: RefreshTokenRequest): ApiResponse<AuthResponse> =
        ApiResponse.success(authService.refreshToken(request.refreshToken), "Token refreshed")

    @PostMapping("/logout")
    fun logout(@RequestBody @Valid request: LogoutRequest): ApiResponse<Void> {
        authService.logout(request.token)
        return ApiResponse.success(message = "Logged out")
    }

    @PutMapping("/profile/{id}")
    fun updateProfile(
        @PathVariable id: String,
        @RequestBody @Valid request: UpdateProfileRequest
    ): ApiResponse<UserProfileResponse> = ApiResponse.success(userService.updateProfile(id, request), "Profile updated")
}
