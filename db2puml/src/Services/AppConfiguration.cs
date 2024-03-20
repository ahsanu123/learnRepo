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

        config.AddBranch<BaseSetting>("generate", branch =>
        {
            branch.AddCommand<GenerateCommand>("puml")
            .WithExample(new[] { "generate", "-n", "filename.puml" });

            branch.AddCommand<GenerateCommand>("svg")
            .WithExample(new[] { "generate", "-n", "filename.svg" });

        });

        config.AddExample(new[] { "generate", "-n", "filename.puml" });

    }

}



