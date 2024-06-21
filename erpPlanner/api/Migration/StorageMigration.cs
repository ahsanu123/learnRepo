using FluentMigrator;

namespace erpPlanner.pMigration;

public class StorageMigration : MigrationChild
{
    public void ChildDown(Migration migration)
    {
        migration.Delete.Table("storage");
    }

    public void ChildUp(Migration migration)
    {
        migration.Create.Table("storage")
          .WithColumn("storageId").AsInt64().PrimaryKey().Identity()
          .WithColumn("name").AsString()
          .WithColumn("location").AsString();
    }
}

