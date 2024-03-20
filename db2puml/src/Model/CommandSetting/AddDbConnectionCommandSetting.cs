using Spectre.Console;
using Spectre.Console.Cli;

namespace DB2PUML.Model;

public class AddDbConnection : BaseSetting
{
    [CommandArgument(0, "<ConnectionString>")]
    public string ConnectionStringName { get; set; } = "defaultConnnectionString";

    [CommandArgument(0, "<value>")]
    public string value { get; set; }
}
