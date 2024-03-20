using Spectre.Console;
using Spectre.Console.Cli;
using Spectre.Console.Cli.Help;
using Spectre.Console.Rendering;

namespace DB2PUML.Shared;

internal class Db2PumlHelpProvider : HelpProvider
{
    public Db2PumlHelpProvider(ICommandAppSettings settings) : base(settings) { }

    public override IEnumerable<IRenderable> GetHeader(ICommandModel model, ICommandInfo? command)
    {
        return new[]
        {
            new Text("--------------------------------------"), Text.NewLine,
            new Text("---           DB2PUML              ---"), Text.NewLine,
            new Text("--------------------------------------"), Text.NewLine,
            Text.NewLine,
        };
    }
}
