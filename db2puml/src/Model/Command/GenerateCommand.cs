using Spectre.Console;
using Spectre.Console.Cli;

using DB2PUML.Model;
using DB2PUML.Shared;


public class GenerateCommand : Command<GenerateSetting>
{
    public override int Execute(CommandContext context, GenerateSetting settings)
    {
        SharedMethod.Dump(settings, "Setting");
        SharedMethod.GeneratePumlOutput(settings);
        string outputPath = Task.Run(async () => await SharedMethod.GenerateGraphicOutput(settings)).Result;
        return 0;
    }

    public override ValidationResult Validate(CommandContext context, GenerateSetting settings)
    {

        if (settings.OutputPath != Directory.GetCurrentDirectory())
        {
            settings.OutputPath = Path.Combine(Directory.GetCurrentDirectory(), settings.OutputPath);
        }

        if (Path.GetExtension(settings.FileName) != "")
        {
            settings.OutputPath = Path.Combine(settings.OutputPath, settings.FileName);
        }

        else
        {
            /* SpectreHelper.SpectreMessage("Please Add File Extension to argument", MessageType.Warning); */
            settings.OutputPath = Path.Combine(settings.OutputPath, $"db2puml.puml");
        }

        return base.Validate(context, settings);
    }
}
