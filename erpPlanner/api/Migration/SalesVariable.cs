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
            .WithColumn("id")
            .AsInt32()
            .Identity()
            .PrimaryKey()
            .WithColumn("tax")
            .AsFloat()
            .WithColumn("marketTax")
            .AsFloat()
            .WithColumn("discount")
            .AsFloat()
            .WithColumn("delivery")
            .AsFloat()
            .WithColumn("return")
            .AsFloat();
    }
}
