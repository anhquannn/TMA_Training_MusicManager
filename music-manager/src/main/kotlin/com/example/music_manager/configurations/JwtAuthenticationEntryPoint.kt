package com.example.music_manager.configurations

import com.example.music_manager.responses.others.ApiResponse
import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.MediaType
import org.springframework.security.core.AuthenticationException
import org.springframework.security.web.AuthenticationEntryPoint
import org.springframework.stereotype.Component

@Component
class JwtAuthenticationEntryPoint : AuthenticationEntryPoint {

    override fun commence(
        request: HttpServletRequest,
        response: HttpServletResponse,
        authException: AuthenticationException
    ) {
        response.status = HttpServletResponse.SC_UNAUTHORIZED
        response.contentType = MediaType.APPLICATION_JSON_VALUE

        val apiResponse = ApiResponse<Unit>(
            code = 401,
            message = "Bạn chưa đăng nhập hoặc token không hợp lệ",
            result = null
        )

        val objectMapper = ObjectMapper()
        response.writer.write(objectMapper.writeValueAsString(apiResponse))
        response.flushBuffer()
    }
}