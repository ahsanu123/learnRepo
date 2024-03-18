using Spectre.Console;

namespace DB2PUML.Shared;

public static class SpectreHelper
{
    public static void UnderlineTextln(string underlineText, string normalText, Color color)
    {
        AnsiConsole.Markup($"[underline {color}]{underlineText}[/] {normalText}\n");
    }
}
