
namespace DB2PUML.Shared;

public static class SharedPuml
{
    public static string PumlHeader = @"
@startuml 
!define primary_key(x) <b><color:#b8861b><&key></color> x</b>
!define foreign_key(x) <color:#aaaaaa><&key></color> x
!define column(x) <color:#efefef><&media-record></color> x
!define table(x) entity ""x"" << (T, white) >>";

    public static string Banner = """

  ██████  ██████  ██████  ██████  ██    ██ ███    ███ ██      
  ██   ██ ██   ██      ██ ██   ██ ██    ██ ████  ████ ██      
  ██   ██ ██████   █████  ██████  ██    ██ ██ ████ ██ ██      
  ██   ██ ██   ██ ██      ██      ██    ██ ██  ██  ██ ██      
  ██████  ██████  ███████ ██       ██████  ██      ██ ███████ 

""";
}

public enum Filetype
{
    SVG = 0,
    PDF,
    PNG
}

