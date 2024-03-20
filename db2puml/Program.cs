using Spectre.Console;
using Spectre.Console.Cli;

using DB2PUML.Model;

string banner = """

  ██████  ██████  ██████  ██████  ██    ██ ███    ███ ██      
  ██   ██ ██   ██      ██ ██   ██ ██    ██ ████  ████ ██      
  ██   ██ ██████   █████  ██████  ██    ██ ██ ████ ██ ██      
  ██   ██ ██   ██ ██      ██      ██    ██ ██  ██  ██ ██      
  ██████  ██████  ███████ ██       ██████  ██      ██ ███████ 

""";


var BannerPanel = new Panel(banner)
{
    Border = BoxBorder.Double
};

AnsiConsole.Write(BannerPanel);

var app = new CommandApp();
app.Configure((config) =>
{
    config.AddBranch<BaseSetting>("add", branch =>
    {
        branch.AddCommand<AddDbConnectionCommand>("connectionstring");
    });
    config.AddBranch<BaseSetting>("generate", branch =>
    {
        branch.AddCommand<GenerateCommand>("puml")
        .WithExample(new[] { "generate", "-n", "filename.puml" });

        branch.AddCommand<GenerateCommand>("svg")
        .WithExample(new[] { "generate", "-n", "filename.svg" });

    });

    config.AddExample(new[] { "generate", "-n", "filename.puml" });


});

app.Run(args);

