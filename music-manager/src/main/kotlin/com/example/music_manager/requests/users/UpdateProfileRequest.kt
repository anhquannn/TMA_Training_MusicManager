package com.example.music_manager.requests.users

import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.validation.constraints.Size

/**
 * Request DTO để cập nhật thông tin hồ sơ người dùng.
 */
data class UpdateProfileRequest(
    @JsonProperty("username") @field:Size(min = 2, max = 50, message = "Tên phải từ 2-50 ký tự")
    val username: String?,
    @JsonProperty("genre") val genre: String?
)
