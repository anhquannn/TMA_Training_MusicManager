package com.example.music_manager.services.users

import com.example.music_manager.requests.users.RegisterRequest
import com.example.music_manager.responses.users.UserProfileResponse
import com.example.music_manager.requests.users.UpdateProfileRequest

interface UserService {
    fun register(request: RegisterRequest): UserProfileResponse
    fun updateProfile(id: String, request: UpdateProfileRequest): UserProfileResponse
}