using Spectre.Console.Cli;

using DB2PUML.Model;

namespace DB2PUML.Service;

public static class AppConfiguration
{
    public static void Configure(IConfigurator config)
    {
        config.AddBranch<BaseSetting>("add", branch =>
        {
            branch.AddCommand<AddDbConnectionCommand>("connectionstring");
        });

        config.AddBranch("generate", branch =>
        {
            branch.AddCommand<GenerateCommand>("svg")
            .WithExample(new[] { "generate", "svg", "--name", "filename", "--type", "svg" });

        });

        /* config.AddExample(new[] { "generate", "-n", "filename.puml" }); */

    }

}



