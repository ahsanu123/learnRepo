using FluentMigrator;

namespace erpPlanner.pMigration;

public class ZForeignKey : MigrationChild
{
    void MigrationChild.ChildDown(Migration migration)
    {
        migration.DeleteTableIfExists("hellYeah");
    }

    void MigrationChild.ChildUp(Migration migration)
    {
        migration
            .Create.ForeignKey()
            .FromTable("buildStep")
            .ForeignColumn("projectId")
            .ToTable("project")
            .PrimaryColumn("id");

        migration
            .Create.ForeignKey()
            .FromTable("component")
            .ForeignColumn("storageId")
            .ToTable("storage")
            .PrimaryColumn("id");
    }
}
