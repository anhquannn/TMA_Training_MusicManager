package com.example.music_manager.configurations

import org.springframework.beans.factory.annotation.Value
import org.springframework.security.oauth2.jose.jws.MacAlgorithm
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.oauth2.jwt.JwtException
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder
import org.springframework.stereotype.Component
import javax.crypto.spec.SecretKeySpec

@Component
class CustomJwtDecoder(
    @Value("\${jwt.signerKey}") private val signerKey: String
) : JwtDecoder {

    private var nimbusJwtDecoder: NimbusJwtDecoder? = null

    override fun decode(token: String): Jwt {
        try {
            if (nimbusJwtDecoder == null) {
                val secretKey = SecretKeySpec(signerKey.toByteArray(), "HmacSHA512")
                nimbusJwtDecoder = NimbusJwtDecoder
                    .withSecretKey(secretKey)
                    .macAlgorithm(MacAlgorithm.HS512)
                    .build()
            }
            return nimbusJwtDecoder!!.decode(token)
        } catch (ex: Exception) {
            throw JwtException("Token không hợp lệ: ${ex.message}")
        }
    }
}