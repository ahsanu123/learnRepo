using DB2PUML.Shared;
using Spectre.Console;
using Spectre.Console.Cli;

namespace DB2PUML.Model;

public class ListCommand : Command<ListSetting>
{
    public override int Execute(CommandContext context, ListSetting settings)
    {
        SharedMethod.Dump(SharedMethod.GetSettingJSon(), "Setting.Json");
        return 0;
    }

    public override ValidationResult Validate(CommandContext context, ListSetting settings)
    {
        return base.Validate(context, settings);
    }
}
