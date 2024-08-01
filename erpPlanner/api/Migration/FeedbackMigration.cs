using FluentMigrator;

namespace erpPlanner.pMigration;

public class FeedbackMigration : MigrationChild
{
    public void ChildDown(Migration migration)
    {
        migration.DeleteTableIfExists("feedback");
    }

    public void ChildUp(Migration migration)
    {
        migration
            .Create.Table("feedback")
            .WithColumn("Id")
            .AsInt32()
            .Identity()
            .PrimaryKey()
            .WithColumn("Overview")
            .AsString()
            .WithColumn("Description")
            .AsString();
    }

    public void SetupForeignKey(Migration migration) { }
}
