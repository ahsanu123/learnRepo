using FluentMigrator;

namespace erpPlanner.pMigration;

public class ScriptToExec : MigrationChild
{
    // this base path belong to /api
    private readonly string DatabaseBasePath = Directory.GetCurrentDirectory() + "/Database";

    void MigrationChild.ChildDown(Migration migration) { }

    void MigrationChild.ChildUp(Migration migration)
    {
        // var listSQLFile = Directory.EnumerateFiles(this.DatabaseBasePath, "*.sql");
        // foreach (var sqlFile in listSQLFile)
        // {
        //     migration.Execute.Script(sqlFile);
        //     Console.WriteLine($"-- {sqlFile}");
        // }
    }

    public void SetupForeignKey(Migration migration) { }
}
