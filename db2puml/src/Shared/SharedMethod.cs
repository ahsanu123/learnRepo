using System.Diagnostics;
using DB2PUML.Model;
using DB2PUML.Service;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Spectre.Console;
using Spectre.Console.Json;

namespace DB2PUML.Shared;


public enum SizeUnits
{
    Byte, KB, MB, GB, TB, PB, EB, ZB, YB
}



public static class SharedMethod
{
    public static void Dump(object obj, string? message)
    {
        var spectreJson = new JsonText(JsonConvert.SerializeObject(obj));
        AnsiConsole.Write(
            new Panel(spectreJson)
                .Header(message != null ? message : "JSON Dump")
                .Collapse()
                .RoundedBorder()
                .BorderColor(Color.Yellow));
    }

    public static bool IsCommandExists(string commandName)
    {
        string fileName;
        if (OperatingSystem.IsWindows())
        {
            fileName = "where";
        }
        else if (OperatingSystem.IsLinux())
        {
            fileName = "which";
        }
        else
        {
            SpectreHelper.SpectreMessage("where or which command not found!!", MessageType.Error);
            return false;
        }

        using (var process = new Process())
        {
            process.StartInfo.UseShellExecute = false;
            process.StartInfo.CreateNoWindow = true;
            process.StartInfo.FileName = fileName;
            process.StartInfo.Arguments = commandName;
            process.Start();
            process.WaitForExit();

            if (process.ExitCode == 1)
            {
                SpectreHelper.SpectreMessage($"{commandName} not found!!", MessageType.Error);
            }
            else
            {
                SpectreHelper.SpectreMessage($"{commandName} found", MessageType.Status);
            }

            return process.ExitCode == 0;
        }
    }

    public static SettingJson GetSettingJSon()
    {
        JObject settingFile = JObject.Parse(File.ReadAllText(Path.GetFullPath("./setting.json")));
        return settingFile.ToObject<SettingJson>();

    }

    public static async Task<string> CheckRequirement()
    {
        SharedMethod.IsCommandExists("java");
        SharedMethod.IsCommandExists("dot");

        if (!String.IsNullOrEmpty(SharedMethod.GetSettingJSon().PlantUmlPath) &&
             File.Exists(Path.GetFullPath(SharedMethod.GetSettingJSon().PlantUmlPath)))
        {
            SpectreHelper.SpectreMessage($"PlantUmlJar Found in {Path.GetFullPath(SharedMethod.GetSettingJSon().PlantUmlPath)}", MessageType.Status);
            return Path.GetFullPath(SharedMethod.GetSettingJSon().PlantUmlPath);
        }
        else
        {
            string plantumlVersion = Path.GetFileName(SharedMethod.GetSettingJSon().PlantUmlDownloadUrl);
            string plantumlUrl = SharedMethod.GetSettingJSon().PlantUmlDownloadUrl;
            string plantumlFilePath = Path.GetFullPath(Path.Combine("./plantuml", plantumlVersion));
            string plantumlFolder = Path.GetDirectoryName(plantumlFilePath);

            SpectreHelper.SpectreMessage(Directory.CreateDirectory(plantumlFolder).Exists ?
                $"Created Folder: {plantumlFolder}" :
                $"Failed Create Folder: {plantumlFolder}", MessageType.Status);

            SpectreHelper.SpectreMessage("PlantUmlJar Not Found, please insert path to setting.json if already downloaded", MessageType.Error);
            SpectreHelper.SpectreMessage($"Downloading {plantumlVersion} to {plantumlFilePath}", MessageType.Status);

            //ref https://webscraping.ai/faq/httpclient-c/can-i-use-httpclient-c-to-download-files
            //https://webscraping.ai/faq/httpclient-c/is-it-possible-to-track-the-progress-of-a-download-using-httpclient-c
            using (var client = new HttpClient())
            {
                var response = await client.GetAsync(plantumlUrl, HttpCompletionOption.ResponseHeadersRead);
                response.EnsureSuccessStatusCode();

                var ContentLength = response.Content.Headers.ContentLength!;

                var fileSize = response.Content.Headers.ContentLength;
                SpectreHelper.SpectreMessage($"Download Size: {SharedMethod.ToSize((long)fileSize, SizeUnits.MB)}", MessageType.Status);

                using (var ms = await response.Content.ReadAsStreamAsync())
                using (var fs = File.Create(plantumlFilePath, 4096, FileOptions.Asynchronous))
                {
                    await AnsiConsole.Progress()
                      .Columns(new ProgressColumn[]
                      {
                        new SpinnerColumn(),
                        new TaskDescriptionColumn()
                      })
                      .StartAsync(async ctx =>
                      {
                          var downloadTask = ctx.AddTask($"[green]Download ${plantumlVersion} [/]");

                          await ms.CopyToAsync(fs);
                          fs.Flush();
                          downloadTask.Increment(100);

                      });
                }
            }
            return plantumlFilePath;
        }
    }

    public static void GeneratePumlOutput(GenerateSetting setting)
    {

        SpectreHelper.SpectreMessage("Reading Setting.json...", MessageType.Status);
        var genTable = new GenerateSqlServerTables(SharedMethod.GetSettingJSon().ConnectionString);

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
                var generatePumlProgress = ctx.AddTask("Generate Puml", false);

                while (!ctx.IsFinished)
                {
                    generatedTable = genTable.Execute(ref GenerateTableProgress);

                    generatePumlProgress.StartTask();
                    generatePumlProgress.Increment(1);
                    GeneratePUML.GenerateAllRelationships(generatedTable, setting.FileName, setting.OutputPath);
                    generatePumlProgress.Increment(100);
                }

            });
    }

    public static async Task<string> GenerateGraphicOutput(GenerateSetting setting)
    {
        string plantumlFilePath = await SharedMethod.CheckRequirement();

        await AnsiConsole.Progress()
          .Columns(new ProgressColumn[]
          {
            new SpinnerColumn(),
            new TaskDescriptionColumn()
          })
          .StartAsync(async ctx =>
          {
              var generateOutputTask = ctx.AddTask($"[green]Generating output in {setting.Filetype} type from {setting.OutputPath}[/]");

              using (var process = new Process())
              {
                  process.StartInfo.UseShellExecute = false;
                  process.StartInfo.CreateNoWindow = true;
                  process.StartInfo.FileName = "java";
                  process.StartInfo.Arguments = $"-jar {plantumlFilePath} {setting.OutputPath} -t{setting.Filetype.ToString().ToLower()} ";

                  process.Start();
                  await process.WaitForExitAsync();
              }
              generateOutputTask.Increment(100);
          });

        return setting.OutputPath;
    }

    // copied from https://stackoverflow.com/a/22733709/19270838
    public static string ToSize(long value, SizeUnits unit)
    {
        return (value / (double)Math.Pow(1024, (Int64)unit)).ToString("0.00") + unit;
    }

}
