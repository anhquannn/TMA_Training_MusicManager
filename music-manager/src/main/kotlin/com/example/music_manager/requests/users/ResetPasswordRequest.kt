package com.example.music_manager.requests.users

import com.fasterxml.jackson.annotation.JsonProperty

data class ResetPasswordRequest(
    @JsonProperty("email") val email: String,
    @JsonProperty("otpCode") val otpCode: String,
    @JsonProperty("newPassword") val newPassword: String,
    @JsonProperty("confirmPassword") val confirmPassword: String
)


