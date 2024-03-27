using Spectre.Console;
using Spectre.Console.Cli;

using DB2PUML.Model;
using DB2PUML.Shared;
using DB2PUML.Service;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Spectre.Console.Json;
using System.Diagnostics;
using System.Net;

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

var genTable = new GenerateSqlServerTables(SharedMethod.GetSettingJSon().ConnectionString);

List<SqlTable> generatedTable = new List<SqlTable>();

await SharedMethod.CheckRequirement();

/* AnsiConsole.Progress() */
/*           .Columns(new ProgressColumn[] */
/*           { */
/*               new SpinnerColumn(), */
/*               new ElapsedTimeColumn(), */
/*               new ProgressBarColumn(), */
/*               new PercentageColumn(), */
/*               new TaskDescriptionColumn(), */
/*           }) */
/*           .Start(ctx => */
/*           { */
/*               var GenerateTableProgress = ctx.AddTask("Generate Table"); */
/**/
/*               while (!ctx.IsFinished) */
/*               { */
/*                   generatedTable = genTable.Execute(ref GenerateTableProgress); */
/**/
/*                   var generatePumlProgress = ctx.AddTask("Writing Table to File", false); */
/*                   generatePumlProgress.StartTask(); */
/*                   GeneratePUML.GenerateAllRelationships(generatedTable, "DMC", "./dmc.puml"); */
/*                   generatePumlProgress.Increment(100); */
/**/
/*               } */
/**/
/*           }); */

/* app.Run(args); */

