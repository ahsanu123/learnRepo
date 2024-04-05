<p >
  <a href="">
    <img alt="npm version" src="https://badgen.net/github/commits/ahsanu123/learnRepo/">
  </a>
  <a href="">
    <img alt="npm" src="https://badgen.net/github/contributors/ahsanu123/learnRepo/">
  </a>
  <a href="">
    <img alt="npm" src="https://badgen.net/github/branches/ahsanu123/learnRepo/">
  </a>
  <a href="https://github.com/ahsanu123/erpPlanner/blob/main/LICENSE">
    <img alt="licence" src="https://badgen.net/github/license/ahsanu123/learnRepo/">
  </a>
</p>

<h1 align="center">DB2PUML</h1>
<p align="center">Toy Project To Generate Databse Server Entity Diagram </p>

<p align="center">  
   <img src="https://raw.githubusercontent.com/ahsanu123/learnRepo/main/db2puml/db2puml_gif.gif" alt="db2puml">
</p>

## DB2PUML
Generate PlantUML Entity Relationship Diagram From Database Tables

This command line utility parses the tables in Database server to generate PlantUML syntax to create diagrams of Databse tables and thier foreign key relationships 

- TODO: add support to postgres, mysql, sqlite

## Prerequisite
- Dotnet 8 for build
- Java for running plantuml
- Graphviz
- PlantUML.jar (auto downloaded if not found)

## Example Usage 
after build, change Connection string in `setting.json`, then you can try to generate svg with 
```shell
dotnet run -- generate svg 
```
you can see example svg/puml output in [output folder](https://github.com/ahsanu123/learnRepo/tree/main/db2puml/output)
![example output](https://github.com/ahsanu123/learnRepo/blob/main/db2puml/output/db2puml.svg "example output SVG")
## Help Command 
```shell
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║   ██████  ██████  ██████  ██████  ██    ██ ███    ███ ██       ║
║   ██   ██ ██   ██      ██ ██   ██ ██    ██ ████  ████ ██       ║
║   ██   ██ ██████   █████  ██████  ██    ██ ██ ████ ██ ██       ║
║   ██   ██ ██   ██ ██      ██      ██    ██ ██  ██  ██ ██       ║
║   ██████  ██████  ███████ ██       ██████  ██      ██ ███████  ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
USAGE:
    db2puml.dll [OPTIONS] <COMMAND>

EXAMPLES:
    db2puml.dll list
    db2puml.dll generate svg --name mysvg
    db2puml.dll generate svg --name mysvg --output svg_output_folder
    db2puml.dll generate pdf --name mydiagrampdf
    db2puml.dll generate pdf --name mydiagrampdf --output myCustomOutputFolder

OPTIONS:
    -h, --help       Prints help information
    -v, --version    Prints version information

COMMANDS:
    config
    generate

```

## Note
- if you use cmd or windows based terminal emoji may not showing up, you can use `chcp 65001 & cmd` to see emoji (ref: https://conemu.github.io/en/UnicodeSupport.html)
- this project forked from https://github.com/OceanAirdrop/SqlServerToPlantUML.git

