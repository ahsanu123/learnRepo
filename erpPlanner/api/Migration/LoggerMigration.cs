using FluentMigrator;

namespace erpPlanner.pMigration;

public class LoggerMigration : MigrationChild
{
    public void ChildDown(Migration migration)
    {
        migration.DeleteTableIfExists("logger");
    }

    public void ChildUp(Migration migration)
    {
        migration
            .Create.Table("logger")
            .WithColumn("id")
            .AsInt32()
            .PrimaryKey()
            .Identity()
            .WithColumn("date")
            .AsDate()
            .NotNullable()
            .WithColumn("title")
            .AsString()
            .NotNullable()
            .WithColumn("description")
            .AsString()
            .WithColumn("projectId")
            .AsInt32();
    }

    public void SetupForeignKey(Migration migration)
    {
        migration
            .Create.ForeignKey()
            .FromTable("logger")
            .ForeignColumn("projectId")
            .ToTable("project")
            .PrimaryColumn("id");
    }
}
