using Spectre.Console;
using Spectre.Console.Cli;

namespace DB2PUML.Model;

public enum SettingType
{
    ConnectionString = 0,
    Another
}

public class BaseSetting : CommandSettings
{
    [CommandArgument(0, "[customContext]")]
    public string customContext { get; set; }
}
