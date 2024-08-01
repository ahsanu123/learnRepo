using FluentMigrator;

namespace erpPlanner.pMigration;

public class ParameterMigration : MigrationChild
{
    public void ChildDown(Migration migration)
    {
        migration.DeleteTableIfExists("parameter");
    }

    public void ChildUp(Migration migration)
    {
        migration
            .Create.Table("parameter")
            .WithColumn("Id")
            .AsInt32()
            .PrimaryKey()
            .Identity()
            .WithColumn("Map")
            .AsString();
    }

    public void SetupForeignKey(Migration migration) { }
}
