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
            .WithColumn("Id")
            .AsInt32()
            .PrimaryKey()
            .Identity()
            .WithColumn("Date")
            .AsDate()
            .NotNullable()
            .WithColumn("Title")
            .AsString()
            .NotNullable()
            .WithColumn("Description")
            .AsString()
            .WithColumn("ProjectId")
            .AsInt32();
    }

    public void SetupForeignKey(Migration migration)
    {
        migration
            .Create.ForeignKey()
            .FromTable("logger")
            .ForeignColumn("ProjectId")
            .ToTable("project")
            .PrimaryColumn("Id");
    }
}
