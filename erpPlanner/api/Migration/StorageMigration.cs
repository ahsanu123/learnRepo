using FluentMigrator;

namespace erpPlanner.pMigration;

public class StorageMigration : MigrationChild
{
    public void ChildDown(Migration migration)
    {
        migration.DeleteTableIfExists("storage");
    }

    public void ChildUp(Migration migration)
    {
        migration
            .Create.Table("storage")
            .WithColumn("id")
            .AsInt64()
            .PrimaryKey()
            .Identity()
            .WithColumn("name")
            .AsString()
            .WithColumn("location")
            .AsString()
            .WithColumn("description")
            .AsString();
    }

    public void SetupForeignKey(Migration migration) { }
}
