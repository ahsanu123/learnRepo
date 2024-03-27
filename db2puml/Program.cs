using Spectre.Console;
using Spectre.Console.Cli;

using DB2PUML.Model;
using DB2PUML.Shared;
using DB2PUML.Service;

var BannerPanel = new Panel(SharedPuml.Banner)
{
    Border = BoxBorder.Double
};

AnsiConsole.Write(BannerPanel);

var app = new CommandApp();
app.Configure((config) =>
{
    AppConfiguration.Configure(config);
});


app.Run(args);

