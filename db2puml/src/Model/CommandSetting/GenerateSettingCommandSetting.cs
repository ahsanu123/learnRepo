using DB2PUML.Shared;
using Spectre.Console.Cli;

namespace DB2PUML.Model;

public class GenerateSetting : CommandSettings
{
    [CommandOption("-o|--output")]
    public string OutputPath { get; set; } = Directory.GetCurrentDirectory();

    [CommandOption("-n|--name <filename>")]
    public string? FileName { get; set; }

    [CommandOption("-t|--type <filetype>")]
    public Filetype Filetype { get; set; }
}
