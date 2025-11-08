package com.example.music_manager.configurations

import com.example.music_manager.models.users.Permission
import com.example.music_manager.models.users.Role
import com.example.music_manager.models.users.User
import com.example.music_manager.repositories.users.PermissionRepository
import com.example.music_manager.repositories.users.RoleRepository
import com.example.music_manager.repositories.users.UserRepository
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component

@Component
class ApplicationInitConfig(
    private val roleRepo: RoleRepository,
    private val permissionRepo: PermissionRepository,
    private val userRepo: UserRepository,
    private val passwordEncoder: PasswordEncoder,
) : ApplicationRunner {
    override fun run(args: ApplicationArguments?) {
        val fullAccess = permissionRepo.findByName("full_access") ?: permissionRepo.save(
            Permission(name = "full_access", description = "Full access to system")
        )
        val adminRole = roleRepo.findByName("ADMIN") ?: roleRepo.save(
            Role(name = "ADMIN", permissions = setOf(fullAccess.id!!))
        )
        val userRole = roleRepo.findByName("USER") ?: roleRepo.save(Role(name = "USER"))

        if (!userRepo.existsByEmail("admin@music.com")) {
            userRepo.save(
                User(
                    username = "Administrator",
                    email = "admin@music.com",
                    password = passwordEncoder.encode("Admin@123"),
                    roles = setOf(adminRole.name)
                )
            )
        }
        if (!userRepo.existsByEmail("user@music.com")) {
            userRepo.save(
                User(
                    username = "Default User",
                    email = "user@music.com",
                    password = passwordEncoder.encode("User@123"),
                    roles = setOf(userRole.name)
                )
            )
        }
    }
}