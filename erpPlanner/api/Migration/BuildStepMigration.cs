using FluentMigrator;

namespace erpPlanner.pMigration;

public class BuildStepMigration : MigrationChild
{
    public void ChildDown(Migration migration)
    {
        migration.DeleteTableIfExists("buildStep");
    }

    public void ChildUp(Migration migration)
    {
        migration
            .Create.Table("buildStep")
            .WithColumn("id")
            .AsInt64()
            .PrimaryKey()
            .Identity()
            .WithColumn("projectId")
            .AsInt64()
            .WithColumn("overview")
            .AsString()
            .WithColumn("description")
            .AsString()
            .WithColumn("liststep")
            .AsString();
    }
}
