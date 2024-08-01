using FluentMigrator;

namespace erpPlanner.pMigration;

public class ProjectMigration : MigrationChild
{
    public void ChildDown(Migration migration)
    {
        migration.DeleteTableIfExists("project");
    }

    public void ChildUp(Migration migration)
    {
        migration
            .Create.Table("project")
            .WithColumn("Id")
            .AsInt32()
            .PrimaryKey()
            .Identity()
            .WithColumn("Name")
            .AsString()
            .WithColumn("CreatedDate")
            .AsDate()
            .WithColumn("DeadLineDate")
            .AsDate()
            .WithColumn("LastUpdatedDate")
            .AsDate()
            .WithColumn("FinishedDate")
            .AsDate()
            .WithColumn("SellPrice")
            .AsDouble()
            .WithColumn("Capital")
            .AsDouble()
            .WithColumn("Fail")
            .AsBoolean()
            .WithColumn("Finish")
            .AsBoolean()
            .WithColumn("ProfitInPersen")
            .AsDouble()
            .WithColumn("Description")
            .AsString();
    }

    public void SetupForeignKey(Migration migration) { }
}
