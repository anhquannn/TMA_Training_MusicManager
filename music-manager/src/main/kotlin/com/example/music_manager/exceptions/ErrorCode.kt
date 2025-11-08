package com.example.music_manager.exceptions

import org.springframework.http.HttpStatus

enum class ErrorCode(val code: Int, val message: String, val status: HttpStatus) {
    UNCATEGORIZED_EXCEPTION(99, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),

    USER_EXISTED(101, "User existed", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(102, "User not exist", HttpStatus.NOT_FOUND),
    USER_UNAUTHENTICATED(103, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    USER_INVALID(104, "Invalid request", HttpStatus.BAD_REQUEST),

    INVALID_TOKEN(105, "Invalid token", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED(106, "You do not have permission", HttpStatus.FORBIDDEN),

    INVALID_OTP(152, "Invalid or Expired OTP", HttpStatus.BAD_REQUEST),
    INVALID_EMAIL(109, "Invalid email", HttpStatus.NOT_FOUND),
    INVALID_CREDENTIALS(110, "Wrong password", HttpStatus.BAD_REQUEST),

    SONG_NOT_FOUND(1008, "Song not found", HttpStatus.NOT_FOUND),
    EMAIL_SEND_FAILED(1009, "Failed to send email", HttpStatus.INTERNAL_SERVER_ERROR),
    OTP_INVALID_OR_EXPIRED(1010, "Invalid or expired OTP", HttpStatus.BAD_REQUEST),
    INVALID_FILE(121, "Invalid file type", HttpStatus.BAD_REQUEST),
    ACCESS_DENIED(122, "Access denied", HttpStatus.FORBIDDEN),
}