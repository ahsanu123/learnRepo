using DB2PUML.Shared;
using Spectre.Console;
using Spectre.Console.Cli;

namespace DB2PUML.Model;

public class AddDbConnectionCommand : Command<AddDbConnection>
{
    public override int Execute(CommandContext context, AddDbConnection settings)
    {

        SpectreHelper.UnderlineTextln("Adding Setting to json file", " ", Color.Green4);
        return 0;
    }
}
