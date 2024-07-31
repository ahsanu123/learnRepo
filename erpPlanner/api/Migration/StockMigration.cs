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
            .WithColumn("id")
            .AsInt32()
            .PrimaryKey()
            .Identity()
            .WithColumn("count")
            .AsInt32()
            .WithColumn("overview")
            .AsString();
    }

    public void SetupForeignKey(Migration migration) { }
}
