using FluentMigrator;

namespace erpPlanner.pMigration;

public class SalesVariableMigration : MigrationChild
{
    public void ChildDown(Migration migration)
    {
        migration.DeleteTableIfExists("salesVariable");
    }

    public void ChildUp(Migration migration)
    {
        migration
            .Create.Table("salesVariable")
            .WithColumn("Id")
            .AsInt32()
            .Identity()
            .PrimaryKey()
            .WithColumn("Tax")
            .AsFloat()
            .WithColumn("MarketTax")
            .AsFloat()
            .WithColumn("Discount")
            .AsFloat()
            .WithColumn("Delivery")
            .AsFloat()
            .WithColumn("Return")
            .AsFloat();
    }

    public void SetupForeignKey(Migration migration) { }
}
