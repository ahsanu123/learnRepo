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
            .WithColumn("id")
            .AsInt32()
            .Identity()
            .PrimaryKey()
            .WithColumn("overview")
            .AsString()
            .WithColumn("description")
            .AsString();
    }
}
