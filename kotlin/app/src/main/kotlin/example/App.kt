package org.example

import javafx.application.Application
import javafx.application.Application.launch
import javafx.scene.Scene
import javafx.scene.control.Label
import javafx.scene.layout.VBox
import javafx.stage.Stage
import java.lang.System

fun main(args: Array<String>) {
    println(args)
    launch(JavaFXExample::class.java)
}

class JavaFXExample : Application() {
    override fun start(primaryStage: Stage) {
        var javaVersion: String = System.getProperty("java.version")
        var javaFxVersion: String = System.getProperty("javafx.version")

        var labelString = "Hello, JavaFx $javaFxVersion, running on $javaVersion"

        val layout =
            VBox().apply {
                children.add(Label(labelString))
            }
        primaryStage.run {
            scene = Scene(layout, 640.0, 480.0)
            show()
        }
    }
}
