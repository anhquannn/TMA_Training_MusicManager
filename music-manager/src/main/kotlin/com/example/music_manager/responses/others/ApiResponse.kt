package com.example.music_manager.responses.others

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
data class ApiResponse<T>(
    val code: Int = 200,
    val message: String? = null,
    val result: T? = null
) {
    fun getSafeResult(): Any {
        // Nếu result != null → trả lại
        if (result != null) return result
        // Nếu null → trả về list rỗng
        return emptyList<Any>()
    }

    companion object {
        fun <T> success(
            result: T? = null,
            message: String = "Thành công",
            code: Int = 200
        ): ApiResponse<T> = ApiResponse(code, message, result)

        fun <T> error(
            message: String = "Lỗi hệ thống",
            code: Int = 500
        ): ApiResponse<T> = ApiResponse(code, message, null)
    }
}