package org.example

import javafx.application.Application
import javafx.beans.property.SimpleIntegerProperty
import javafx.beans.value.ChangeListener
import javafx.scene.Scene
import javafx.scene.control.Button
import javafx.scene.control.Label
import javafx.scene.control.TextField
import javafx.scene.layout.HBox
import javafx.scene.layout.VBox
import javafx.scene.text.Font
import javafx.stage.Stage
import java.lang.System
import kotlin.io.println

fun listenerTest() {
    var counter = SimpleIntegerProperty(100)
    var listener =
        ChangeListener<Number>({ prop, old, new ->
            println("Counter Changed With Variable")
            println("-- Observable $prop")
            println("-- From $old")
            println("-- To $new")
        })

    counter.addListener(listener)
    counter.addListener(
        ChangeListener { prop, old, new ->
            println("Counter Changed with Lambda")
            println("-- Observable $prop")
            println("-- From $old")
            println("-- To $new")
        },
    )
    counter.set(102)
}

class JavaFXIntro : Application() {
    override fun init() {
        println(messageWithTime("Init Function Called"))
        println(messageWithTime("Thread Name: ${Thread.currentThread().name}"))
        listenerTest()
    }

    override fun start(primaryStage: Stage) {
        var greetingMessage = Label("First Fx Application")
        greetingMessage.font = Font(40.0)
        greetingMessage.style = "-fx-text-fill: blue;"

        var nameField = TextField()

        var helloButton = Button("Say Hello")
        helloButton.setOnAction { event ->
            println(event)
            greetingMessage.text = "Hello World ${nameField.text}"
        }

        var buttonBar = HBox(20.0, helloButton)

        var javaVersion: String = System.getProperty("java.version")
        var javaFxVersion: String = System.getProperty("javafx.version")
        var labelJavaFx = Label("Hello, JavaFx $javaFxVersion, running on $javaVersion")

        val layout =
            VBox().apply {
                children.add(labelJavaFx)
                children.add(greetingMessage)
                children.add(nameField)
                children.add(buttonBar)
            }
        primaryStage.run {
            title = "Sore V2 Desktop"
            scene = Scene(layout, 640.0, 480.0)
            show()
        }
    }

    override fun stop() {
        println(messageWithTime("Stoped Thread: ${Thread.currentThread().name}"))
    }
}
