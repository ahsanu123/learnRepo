package org.example

import javafx.application.Application
import java.time.LocalDateTime
import kotlin.io.println

interface Clickable {
    fun click()
}

interface Focusable {
    fun setFocus(b: Boolean) = println("${if (b) "hell" else "yeah" }")
}

fun interface IntCondition {
    fun check(i: Int): Boolean

    fun checkString(s: String) = check(s.toInt())

    fun checkChar(c: Char) = check(c.digitToInt())
}

fun main(args: Array<String>) {
    println(args.toString())
    // Application.launch(JavaFXIntro::class.java)
    Application.launch(CenterCircle::class.java)
}

fun messageWithTime(message: String): String = "[${LocalDateTime.now()}] $message"
