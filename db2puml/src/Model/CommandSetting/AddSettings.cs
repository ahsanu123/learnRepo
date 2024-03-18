using Spectre.Console.Cli;

namespace DB2PUML.Model;

public enum SettingType
{
    ConnectionString = 0,
    Another
}

public class AddSettings : CommandSettings
{
    [CommandArgument(0, "[CommandName]")]
    public SettingType SubCommand { get; set; }
}
