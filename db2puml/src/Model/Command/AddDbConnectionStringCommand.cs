using DB2PUML.Shared;
using Spectre.Console;
using Spectre.Console.Cli;

namespace DB2PUML.Model;

public class AddDbConnectionCommand : Command<AddDbConnection>
{
    public override int Execute(CommandContext context, AddDbConnection settings)
    {
        Console.WriteLine($"adding new Connection string with name {settings.ConnectionStringName} with value {settings.value}");
        return 0;
    }

    public override ValidationResult Validate(CommandContext context, AddDbConnection settings)
    {
        return base.Validate(context, settings);
    }
}
