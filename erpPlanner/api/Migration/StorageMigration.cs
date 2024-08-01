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
            .WithColumn("Id")
            .AsInt64()
            .PrimaryKey()
            .Identity()
            .WithColumn("Name")
            .AsString()
            .WithColumn("Location")
            .AsString()
            .WithColumn("Description")
            .AsString();
    }

    public void SetupForeignKey(Migration migration) { }
}
