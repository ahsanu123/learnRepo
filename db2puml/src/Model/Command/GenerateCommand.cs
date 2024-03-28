using Spectre.Console;
using Spectre.Console.Cli;

using DB2PUML.Model;
using DB2PUML.Shared;

public class GenerateCommand : Command<GenerateSetting>
{
    public override int Execute(CommandContext context, GenerateSetting settings)
    {
        /* SharedMethod.Dump(settings, "Setting"); */
        /* SharedMethod.Dump(context, "context"); */
        SharedMethod.GeneratePumlOutput(settings);
        string outputPath = Task.Run(async () => await SharedMethod.GenerateGraphicOutput(settings)).Result;
        return 0;
    }

    public override ValidationResult Validate(CommandContext context, GenerateSetting settings)
    {

        if (settings.OutputPath != Directory.GetCurrentDirectory())
        {
            settings.OutputPath = Path.Combine(Directory.GetCurrentDirectory(), settings.OutputPath);

            if (!Directory.Exists(settings.OutputPath))
                Directory.CreateDirectory(settings.OutputPath);
        }
        else if (settings.OutputPath == Directory.GetCurrentDirectory())
        {
            if (!Directory.Exists("output"))
                Directory.CreateDirectory("output");
            settings.OutputPath = Path.GetFullPath("output");
        }

        if (settings.Filetype.ToString() != context.Name.ToUpper())
        {
            Filetype type;
            Enum.TryParse(context.Name.ToUpper(), out type);
            settings.Filetype = type;
        }


        if (!String.IsNullOrEmpty(settings.FileName))
        {
            settings.OutputPath = Path.Combine(settings.OutputPath, String.Concat(settings.FileName, ".", context.Name));
        }

        else
        {
            settings.OutputPath = Path.Combine(settings.OutputPath, $"db2puml.puml");
        }

        return base.Validate(context, settings);
    }
}
