using FluentMigrator;

namespace erpPlanner.pMigration;

public class ZForeignKey : MigrationChild
{
    // this base path belong to /api
    private readonly string DatabaseBasePath = Directory.GetCurrentDirectory() + "/Database";

    void MigrationChild.ChildDown(Migration migration)
    {
        migration.DeleteTableIfExists("hellYeah");
    }

    void MigrationChild.ChildUp(Migration migration)
    {
        // migration
        //     .Create.ForeignKey()
        //     .FromTable("buildStep")
        //     .ForeignColumn("projectId")
        //     .ToTable("project")
        //     .PrimaryColumn("id");
        //
        // migration
        //     .Create.ForeignKey()
        //     .FromTable("component")
        //     .ForeignColumn("storageId")
        //     .ToTable("storage")
        //     .PrimaryColumn("id");

        var listSQLFile = Directory.EnumerateFiles(this.DatabaseBasePath, "*.sql");
        foreach (var sqlFile in listSQLFile)
        {
            migration.Execute.Script(sqlFile);
            Console.WriteLine($"-- {sqlFile}");
        }
    }
}
