package com.example.music_manager.exceptions

import com.example.music_manager.responses.others.ApiResponse
import jakarta.validation.ConstraintViolation
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class GlobalExceptionHandler {
    private val logger = LoggerFactory.getLogger(GlobalExceptionHandler::class.java)

    companion object {
        private const val MIN_ATTRIBUTE = "min"
    }

    @ExceptionHandler(AppException::class)
    fun handleAppException(ex: AppException): ResponseEntity<ApiResponse<Any>> {
        logger.error("AppException: {}", ex.message, ex)

        val errorCode = ex.errorCode
        val apiResponse = ApiResponse<Any>(
            code = errorCode.code,
            message = errorCode.message,
            result = null
        )
        return ResponseEntity.status(errorCode.status).body(apiResponse)
    }

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationException(ex: MethodArgumentNotValidException): ResponseEntity<ApiResponse<Any>> {
        logger.error("Validation error: {}", ex.message, ex)

        val enumKey = ex.fieldError?.defaultMessage ?: "UNCATEGORIZED_EXCEPTION"
        var errorCode = ErrorCode.UNCATEGORIZED_EXCEPTION
        var attributes: Map<String, Any>? = null

        try {
            errorCode = ErrorCode.valueOf(enumKey)
            val constraintViolation: ConstraintViolation<*>? =
                ex.bindingResult.allErrors.firstOrNull()?.unwrap(ConstraintViolation::class.java)
            attributes = constraintViolation?.constraintDescriptor?.attributes
        } catch (_: Exception) { }

        val msg = attributes?.let { mapAttribute(errorCode.message, it) } ?: errorCode.message

        val apiResponse = ApiResponse<Any>(
            code = errorCode.code,
            message = msg,
            result = null
        )
        return ResponseEntity.badRequest().body(apiResponse)
    }

    @ExceptionHandler(AccessDeniedException::class)
    fun handleAccessDeniedException(ex: AccessDeniedException): ResponseEntity<ApiResponse<Any>> {
        val errorCode = ErrorCode.UNAUTHORIZED
        val apiResponse = ApiResponse<Any>(
            code = errorCode.code,
            message = errorCode.message,
            result = null
        )
        return ResponseEntity.status(errorCode.status).body(apiResponse)
    }

    @ExceptionHandler(RuntimeException::class)
    fun handleRuntimeException(ex: RuntimeException): ResponseEntity<ApiResponse<Any>> {
        logger.error("Unhandled RuntimeException: {}", ex.message, ex)

        val apiResponse = ApiResponse<Any>(
            code = ErrorCode.UNCATEGORIZED_EXCEPTION.code,
            message = ErrorCode.UNCATEGORIZED_EXCEPTION.message,
            result = null
        )
        return ResponseEntity.badRequest().body(apiResponse)
    }

    private fun mapAttribute(message: String, attributes: Map<String, Any>): String {
        val minValue = attributes[MIN_ATTRIBUTE]?.toString() ?: ""
        return message.replace("{$MIN_ATTRIBUTE}", minValue)
    }
}