using FluentMigrator;

namespace erpPlanner.pMigration;

public class StockMigration : MigrationChild
{
    public void ChildDown(Migration migration)
    {
        migration.DeleteTableIfExists("stock");
    }

    public void ChildUp(Migration migration)
    {
        migration
            .Create.Table("stock")
            .WithColumn("Id")
            .AsInt32()
            .PrimaryKey()
            .Identity()
            .WithColumn("Count")
            .AsInt32()
            .WithColumn("Overview")
            .AsString();
    }

    public void SetupForeignKey(Migration migration) { }
}
