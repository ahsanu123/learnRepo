using Newtonsoft.Json;
using Spectre.Console;
using Spectre.Console.Json;

namespace DB2PUML.Shared;


public static class SharedMethod
{
    public static void Dump(object obj, string? message)
    {
        var spectreJson = new JsonText(JsonConvert.SerializeObject(obj));
        AnsiConsole.Write(
            new Panel(spectreJson)
                .Header(message != null ? message : "JSON Dump")
                .Collapse()
                .RoundedBorder()
                .BorderColor(Color.Yellow));
    }
}
