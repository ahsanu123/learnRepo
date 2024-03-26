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

var generatedTable = genTable.Execute();

foreach (var tab in generatedTable)
{
    string stringTable = JsonConvert.SerializeObject(tab);
    AnsiConsole.Write(
        new Panel(new JsonText(stringTable))
            .RoundedBorder()
        );
}

app.Run(args);

