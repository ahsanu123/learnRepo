using Spectre.Console.Cli;

using DB2PUML.Model;

namespace DB2PUML.Service;

public static class AppConfiguration
{
    public static void Configure(IConfigurator config)
    {
        config.AddBranch("config", branch =>
        {
            branch.AddCommand<ListCommand>("list")
              .WithExample(new[] { "list" });
        });

        config.AddBranch("generate", branch =>
        {
            branch.AddCommand<GenerateCommand>("svg")
              .WithExample(new[] { "generate", "svg", "--name", "mysvg" })
              .WithExample(new[] { "generate", "svg", "--name", "mysvg", "--output", "svg_output_folder" });

            branch.AddCommand<GenerateCommand>("pdf")
              .WithExample(new[] { "generate", "pdf", "--name", "mydiagrampdf" })
              .WithExample(new[] { "generate", "pdf", "--name", "mydiagrampdf", "--output", "myCustomOutputFolder" });

            branch.AddCommand<GenerateCommand>("png")
              .WithExample(new[] { "generate", "png", "--name", "outputdiagrampng" })
              .WithExample(new[] { "generate", "png", "--name", "pngFile", "--output", "pngOutput" });

        });
    }

}



