using Spectre.Console;

namespace DB2PUML.Shared;

public static class SpectreHelper
{
    public static void UnderlineTextln(string underlineText, string normalText, Color color)
    {
        AnsiConsole.Markup($"[underline {color}]{underlineText}[/] {normalText}\n");
    }

    public static void SpectreMessage(string message, MessageType type)
    {
        switch (type)
        {
            case MessageType.Status:
                AnsiConsole.Markup(":check_mark_button:");
                AnsiConsole.Markup($"[bold {Color.Green}]Message: [/] {message}\n");
                break;

            case MessageType.Warning:
                AnsiConsole.Markup(":police_car_light:");
                AnsiConsole.Markup($"[bold {Color.Orange1}]Warning: [/] {message}\n");
                break;

            case MessageType.Danger:
                AnsiConsole.Markup(":warning:");
                AnsiConsole.Markup($"[bold {Color.Red3}]Danger: [/] {message}\n");
                break;

            case MessageType.Error:
                AnsiConsole.Markup(":skull:");
                AnsiConsole.Markup($"[bold {Color.Red}]Error: [/] {message}\n");
                break;

            default:
                AnsiConsole.Markup(message);
                break;

        }
    }
}
