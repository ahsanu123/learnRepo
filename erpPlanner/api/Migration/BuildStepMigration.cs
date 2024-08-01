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
            .WithColumn("Id")
            .AsInt64()
            .PrimaryKey()
            .Identity()
            .WithColumn("ProjectId")
            .AsInt64()
            .WithColumn("Overview")
            .AsString()
            .WithColumn("Description")
            .AsString()
            .WithColumn("Liststep")
            .AsString();
    }

    public void SetupForeignKey(Migration migration) { }
}
