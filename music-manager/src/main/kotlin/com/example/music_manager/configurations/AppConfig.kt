package com.example.music_manager.configurations

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.client.RestTemplate
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@Configuration
class AppConfig {
    @Bean
    fun restTemplate(): RestTemplate = RestTemplate()

    @Bean
    fun objectMapper(): ObjectMapper {
        val mapper = ObjectMapper()
        val module = JavaTimeModule()
        val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")

        module.addSerializer(LocalDateTime::class.java, LocalDateTimeSerializer(formatter))
        module.addDeserializer(LocalDateTime::class.java, LocalDateTimeDeserializer(formatter))

        mapper.registerModule(module)
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
        return mapper
    }
}