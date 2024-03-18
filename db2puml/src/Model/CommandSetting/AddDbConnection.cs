using Spectre.Console.Cli;

namespace DB2PUML.Model;

public class AddDbConnection : AddSettings
{
    [CommandArgument(0, "<ConnectionString>")]
    public string ConnectionStringName { get; set; } = "defaultConnnectionString";

    [CommandArgument(0, "<secondArg>")]
    public string secondArg { get; set; }

}
