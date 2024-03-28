
namespace DB2PUML.Shared;

public enum DbProvider
{
    SQLSERVER = 0,
    POSTGRESQL,
    MYSQL,
    SQLITE
}

public class SettingJson
{
    public string ConnectionString { get; set; }
    public string PlantUmlPath { get; set; }
    public string PlantUmlDownloadUrl { get; set; }
    public DbProvider DbProvider { get; set; }
    public ConnectionModel ConnectionModel { get; set; }
}

public class ConnectionModel
{
    public string Server { get; set; }
    public string Database { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
}
