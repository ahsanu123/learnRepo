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
            .WithColumn("id")
            .AsInt32()
            .PrimaryKey()
            .Identity()
            .WithColumn("name")
            .AsString()
            .WithColumn("createdDate")
            .AsDate()
            .WithColumn("deadlineDate")
            .AsDate()
            .WithColumn("lastupdateDate")
            .AsDate()
            .WithColumn("finishDate")
            .AsDate()
            .WithColumn("sellPrice")
            .AsDouble()
            .WithColumn("capital")
            .AsDouble()
            .WithColumn("fail")
            .AsBoolean()
            .WithColumn("finish")
            .AsBoolean()
            .WithColumn("profitInPersen")
            .AsDouble()
            .WithColumn("description")
            .AsString();
    }

    public void SetupForeignKey(Migration migration) { }
}
