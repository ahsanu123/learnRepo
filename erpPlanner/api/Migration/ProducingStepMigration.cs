using FluentMigrator;

namespace erpPlanner.pMigration;

public class ProducingStepMigration : MigrationChild
{
    public void ChildDown(Migration migration)
    {
        migration.DeleteTableIfExists("producingStep");
    }

    public void ChildUp(Migration migration)
    {
        migration
            .Create.Table("producingStep")
            .WithColumn("Id")
            .AsInt32()
            .Identity()
            .PrimaryKey()
            .WithColumn("ListStep")
            .AsString()
            .WithColumn("ProjectId")
            .AsInt32()
            .Nullable();
    }

    public void SetupForeignKey(Migration migration)
    {
        migration
            .Create.ForeignKey()
            .FromTable("producingStep")
            .ForeignColumn("ProjectId")
            .ToTable("project")
            .PrimaryColumn("Id");
    }
}
