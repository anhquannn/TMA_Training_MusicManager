package com.example.music_manager.exceptions

class AppException(val errorCode: ErrorCode) : RuntimeException(errorCode.message) {
}