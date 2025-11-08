package com.example.music_manager.services.users

import com.example.music_manager.exceptions.AppException
import com.example.music_manager.exceptions.ErrorCode
import com.example.music_manager.mappers.users.UserMapper
import com.example.music_manager.repositories.users.UserRepository
import com.example.music_manager.requests.users.RegisterRequest
import com.example.music_manager.requests.users.UpdateProfileRequest
import com.example.music_manager.responses.users.UserProfileResponse
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class UserServiceImpl(
    private val userRepository: UserRepository,
    private val userMapper: UserMapper,
    private val passwordEncoder: PasswordEncoder
) : UserService {

    override fun register(request: RegisterRequest): UserProfileResponse {
        if (userRepository.existsByEmail(request.email)) {
            throw AppException(ErrorCode.USER_EXISTED)
        }
        val user = userMapper.toUser(request).copy(
            password = passwordEncoder.encode(request.password)
        )
        return userMapper.toUserResponse(userRepository.save(user))
    }

    override fun updateProfile(id: String, request: UpdateProfileRequest): UserProfileResponse {
        val user = userRepository.findById(id)
            .orElseThrow { AppException(ErrorCode.USER_NOT_EXISTED) }
        val updated = user.copy(username = request.username ?: user.username)
        return userMapper.toUserResponse(userRepository.save(updated))
    }
}