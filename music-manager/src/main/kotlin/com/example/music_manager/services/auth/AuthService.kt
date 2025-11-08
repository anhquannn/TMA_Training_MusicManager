package com.example.music_manager.services.auth

import com.example.music_manager.responses.users.AuthResponse

interface AuthService {
    fun login(email: String, password: String): AuthResponse
    fun refreshToken(refreshToken: String): AuthResponse
    fun logout(token: String)
}
