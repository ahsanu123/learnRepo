package org.ahah.toya

interface Platform {
    val name: String
}

expect fun getPlatform(): Platform