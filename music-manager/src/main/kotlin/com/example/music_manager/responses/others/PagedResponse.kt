package com.example.music_manager.responses.others

import com.fasterxml.jackson.annotation.JsonProperty

data class PagedResponse<T>(
    @JsonProperty("content") val content: List<T>,
    @JsonProperty("page") val page: Int,
    @JsonProperty("size") val size: Int,
    @JsonProperty("totalElements") val totalElements: Long,
    @JsonProperty("totalPages") val totalPages: Int,
    @JsonProperty("first") val first: Boolean,
    @JsonProperty("last") val last: Boolean,
    @JsonProperty("hasNext") val hasNext: Boolean,
    @JsonProperty("hasPrevious") val hasPrevious: Boolean
) {
    companion object {
        fun <T> of(
            content: List<T>,
            page: Int,
            size: Int,
            totalElements: Long
        ): PagedResponse<T> {
            val totalPages = if (size == 0) 1 else ((totalElements + size - 1) / size).toInt()
            return PagedResponse(
                content = content,
                page = page,
                size = size,
                totalElements = totalElements,
                totalPages = totalPages,
                first = page == 0,
                last = page >= totalPages - 1,
                hasNext = page < totalPages - 1,
                hasPrevious = page > 0
            )
        }
    }
}
