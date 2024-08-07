package org.example

import javafx.application.Application
import javafx.beans.binding.Bindings
import javafx.scene.Group
import javafx.scene.Scene
import javafx.scene.control.Button
import javafx.scene.layout.HBox
import javafx.scene.paint.Color
import javafx.scene.shape.Circle
import javafx.stage.Stage

class CenterCircle : Application() {
    override fun init() {
        println("-- Init Function Called ")
    }

    override fun start(stage: Stage) {
        var circle = Circle()
        var toBlue = Button("Change To Blue")
        var toRed = Button("Change To Red")
        var root = Group(circle)
        var buttonBar = HBox(10.0)

        circle.fill = Color.BLUE
        toRed.setOnAction { event ->
            circle.fill = Color.RED
        }
        toBlue.setOnAction { event ->
            circle.fill = Color.BLUE
        }

        buttonBar.getChildren().addAll(toRed, toBlue)
        root.getChildren().addAll(buttonBar)

        stage.run {
            title = "Center Circle with Bindings"
            scene = Scene(root, 640.0, 480.0)

            circle.centerXProperty().bind(scene.widthProperty().divide(2))
            circle.centerYProperty().bind(scene.heightProperty().divide(2))
            circle.radiusProperty().bind(
                Bindings
                    .min(
                        scene.widthProperty(),
                        scene.heightProperty(),
                    ).divide(2),
            )

            show()
        }
    }
}
