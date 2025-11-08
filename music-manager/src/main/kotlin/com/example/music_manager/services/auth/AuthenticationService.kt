package com.example.music_manager.services.auth

import com.example.music_manager.exceptions.AppException
import com.example.music_manager.exceptions.ErrorCode
import com.example.music_manager.models.users.InvalidatedToken
import com.example.music_manager.models.users.User
import com.example.music_manager.repositories.users.InvalidatedTokenRepository
import com.example.music_manager.repositories.users.UserRepository
import com.example.music_manager.responses.users.AuthResponse
import com.nimbusds.jose.JOSEException
import com.nimbusds.jose.JWSAlgorithm
import com.nimbusds.jose.JWSHeader
import com.nimbusds.jose.JWSObject
import com.nimbusds.jose.crypto.MACSigner
import com.nimbusds.jose.crypto.MACVerifier
import com.nimbusds.jwt.JWTClaimsSet
import com.nimbusds.jwt.SignedJWT
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import com.example.music_manager.services.auth.AuthService
import java.text.ParseException
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.*

@Service
class JwtAuthService(
    private val userRepository: UserRepository,
    private val invalidatedTokenRepository: InvalidatedTokenRepository,
    @Value("\${jwt.signerKey}") private val signerKey: String,
    @Value("\${jwt.valid-duration}") private val validDuration: Long,
    @Value("\${jwt.refreshable-duration}") private val refreshableDuration: Long,
) : AuthService {

    override fun login(email: String, password: String): AuthResponse {
        val user = userRepository.findByEmail(email) ?: throw AppException(ErrorCode.USER_NOT_EXISTED)
        val encoder: PasswordEncoder = BCryptPasswordEncoder(10)
        if (!encoder.matches(password, user.password)) throw AppException(ErrorCode.INVALID_CREDENTIALS)
        val access = generateToken(user, false)
        val refresh = generateToken(user, true)
        return AuthResponse(access, refresh, expiresIn = validDuration * 3600)
    }

    override fun refreshToken(refreshToken: String): AuthResponse {
        val signed = verifyToken(refreshToken, true)
        if (signed.jwtClaimsSet.getStringClaim("token_type") != "refresh") throw AppException(ErrorCode.INVALID_TOKEN)
        val email = signed.jwtClaimsSet.subject
        val user = userRepository.findByEmail(email) ?: throw AppException(ErrorCode.USER_NOT_EXISTED)
        // invalidate old refresh
        invalidatedTokenRepository.save(
            InvalidatedToken(signed.jwtClaimsSet.jwtid, signed.jwtClaimsSet.expirationTime.toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDateTime())
        )
        val access = generateToken(user, false)
        val refresh = generateToken(user, true)
        return AuthResponse(access, refresh, expiresIn = validDuration * 3600)
    }

    override fun logout(token: String) {
        val signed = verifyToken(token, false)
        invalidatedTokenRepository.save(
            InvalidatedToken(signed.jwtClaimsSet.jwtid, signed.jwtClaimsSet.expirationTime.toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDateTime())
        )
    }

    private fun generateToken(user: User, refresh: Boolean): String {
        val header = JWSHeader(JWSAlgorithm.HS512)
        val expireHours = if (refresh) refreshableDuration else validDuration
        val claims = JWTClaimsSet.Builder()
            .subject(user.email)
            .issuer("music-manager")
            .issueTime(Date())
            .expirationTime(Date(Instant.now().plus(expireHours, ChronoUnit.HOURS).toEpochMilli()))
            .jwtID(UUID.randomUUID().toString())
            .claim("userId", user.id)
            .claim("token_type", if (refresh) "refresh" else "access")
            .claim("scope", user.roles.joinToString(" "))
            .build()
        val jws = JWSObject(header, com.nimbusds.jose.Payload(claims.toJSONObject()))
        try {
            jws.sign(MACSigner(signerKey.toByteArray()))
        } catch (e: JOSEException) {
            throw AppException(ErrorCode.INVALID_TOKEN)
        }
        return jws.serialize()
    }

    private fun verifyToken(token: String, refresh: Boolean): SignedJWT {
        val signed: SignedJWT
        try {
            signed = SignedJWT.parse(token)
        } catch (e: ParseException) {
            throw AppException(ErrorCode.INVALID_TOKEN)
        }
        val verifier = MACVerifier(signerKey.toByteArray())
        val verified = signed.verify(verifier)
        val expiry = if (refresh) {
            Date(signed.jwtClaimsSet.issueTime.toInstant().plus(refreshableDuration, ChronoUnit.HOURS).toEpochMilli())
        } else {
            signed.jwtClaimsSet.expirationTime
        }
        if (!(verified && expiry.after(Date()))) throw AppException(ErrorCode.INVALID_TOKEN)
        if (invalidatedTokenRepository.existsById(signed.jwtClaimsSet.jwtid)) throw AppException(ErrorCode.INVALID_TOKEN)
        return signed
    }
}
