// See https://aka.ms/new-console-template for more information
//
using Newtonsoft.Json.Linq;
using Spectre.Console;
using Spectre.Console.Json;
using Spectre.Console.Cli;

using DB2PUML.Model;
using DB2PUML.Shared;


SpectreHelper.UnderlineTextln("Hello World Underlined", " with normal text", Color.LightSalmon3_1);

var app = new CommandApp();

app.Configure((config) =>
{
    config.AddBranch<AddSettings>("add", add =>
    {
        add.AddCommand<AddDbConnectionCommand>("connectionstring");
        add.AddCommand<AddDbConnectionCommand>("secondSubCommand");
    });

});

app.Run(args);

/* Parser.Default.ParseArguments<ParserOption>(args) */
/*   .WithParsed<ParserOption>((arg) => */
/*   { */
/*       if (arg.setting != null) */
/*       { */
/*           string customFileName = $"./{arg.setting}"; */
/*           JObject settingFile = JObject.Parse(File.ReadAllText(customFileName)); */
/*           var json = new JsonText(File.ReadAllText(customFileName)); */
/**/
/*           AnsiConsole.Write( */
/*               new Panel(json) */
/*                   .Header("Some JSON in a panel") */
/*                   .Collapse() */
/*                   .RoundedBorder() */
/*                   .BorderColor(Color.Yellow)); */
/*       } */
/**/
/*       else */
/*       { */
/**/
/*       } */
/*   }); */
/**/
