package com.example.music_manager.mappers.users

import com.example.music_manager.models.users.User
import com.example.music_manager.requests.users.RegisterRequest
import com.example.music_manager.responses.users.UserProfileResponse
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.MappingTarget
import org.mapstruct.NullValuePropertyMappingStrategy

@Mapper(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
interface UserMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roles", expression = "java(java.util.Set.of(\"USER\"))")
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isActive", constant = "true")
    fun toUser(request: RegisterRequest): User

    fun toUserResponse(user: User): UserProfileResponse

    fun updateUser(@MappingTarget user: User, request: RegisterRequest)
}