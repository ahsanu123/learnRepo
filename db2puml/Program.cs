using Spectre.Console;
using Spectre.Console.Cli;

using DB2PUML.Model;
using DB2PUML.Shared;
using DB2PUML.Service;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Spectre.Console.Json;

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

JObject settingFile = JObject.Parse(File.ReadAllText(Path.GetFullPath("./setting.json")));
SettingJson setting = settingFile.ToObject<SettingJson>();
var genTable = new GenerateSqlServerTables(setting.ConnectionString);

List<SqlTable> generatedTable = new List<SqlTable>();

AnsiConsole.Progress()
          .Columns(new ProgressColumn[]
          {
              new SpinnerColumn(),
              new ElapsedTimeColumn(),
              new ProgressBarColumn(),
              new PercentageColumn(),
              new TaskDescriptionColumn(),
          })
          .Start(ctx =>
          {
              var GenerateTableProgress = ctx.AddTask("Generate Table");
              var generatePumlProgress = ctx.AddTask("Generate Puml");

              while (!ctx.IsFinished)
              {
                  generatedTable = genTable.Execute(ref GenerateTableProgress);

                  generatePumlProgress.Increment(1);
                  GeneratePUML.GenerateAllRelationships(generatedTable, "DMC", "./dmc.puml");
                  generatePumlProgress.Increment(100);
              }

          });

app.Run(args);

