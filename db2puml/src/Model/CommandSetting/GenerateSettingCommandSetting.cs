using System.IO;
using System.Reflection;
using Newtonsoft.Json;
using Spectre.Console;
using Spectre.Console.Cli;

using DB2PUML.Shared;

namespace DB2PUML.Model;

public class GenerateSetting : BaseSetting
{
    [CommandArgument(0, "[output]")]
    public string OutputPath { get; set; } = Directory.GetCurrentDirectory();

    [CommandOption("-n|--name <filename>")]
    public string? FileName { get; set; }
}
