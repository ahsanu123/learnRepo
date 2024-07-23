package org.example

import javafx.application.Application
import javafx.application.Application.launch
import javafx.scene.Scene
import javafx.scene.control.Button
import javafx.scene.control.Label
import javafx.scene.layout.HBox
import javafx.scene.layout.VBox
import javafx.scene.text.Font
import javafx.stage.Stage
import java.lang.System
import kotlin.collections.listOf

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
    launch(JavaFXExample::class.java)
}

class JavaFXExample : Application() {
    override fun start(primaryStage: Stage) {
        var message = Label("First Fx Application")
        message.font = Font(40.0)

        var helloButton = Button("Say Hello")
        helloButton.setOnAction { event ->
            println(event)
            message.text = "Hello World"
        }

        var buttonBar = HBox(20.0, helloButton)

        var javaVersion: String = System.getProperty("java.version")
        var javaFxVersion: String = System.getProperty("javafx.version")

        var listInt = listOf(1, 2, 3, 4, 6)
        listInt.maxByOrNull { selector: Int -> selector }

        var labelString = "Hello, JavaFx $javaFxVersion, running on $javaVersion"

        val layout =
            VBox().apply {
                children.add(Label(labelString))
                children.add(message)
                children.add(buttonBar)
            }
        primaryStage.run {
            scene = Scene(layout, 640.0, 480.0)
            show()
        }
    }
}
