package com.example.music_manager.requests.users

import com.fasterxml.jackson.annotation.JsonProperty

data class VerifyOtpRequest(
    @JsonProperty("email") val email: String,
    @JsonProperty("otpCode") val otpCode: String
)
