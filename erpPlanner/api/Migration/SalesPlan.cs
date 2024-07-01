using FluentMigrator;

namespace erpPlanner.pMigration;

public class SalesPlan : MigrationChild
{
    public void ChildDown(Migration migration)
    {
        migration.DeleteTableIfExists("salesPlan");
    }

    public void ChildUp(Migration migration)
    {
        migration
            .Create.Table("salesPlan")
            .WithColumn("id")
            .AsInt32()
            .Identity()
            .PrimaryKey()
            .WithColumn("description")
            .AsString();
    }
}
