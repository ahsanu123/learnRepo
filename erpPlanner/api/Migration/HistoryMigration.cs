using FluentMigrator;

namespace erpPlanner.pMigration;

public class HistoryMigration : MigrationChild
{
    public void ChildDown(Migration migration)
    {
        migration.DeleteTableIfExists("history");
    }

    public void ChildUp(Migration migration)
    {
        migration
            .Create.Table("history")
            .WithColumn("id")
            .AsInt32()
            .Identity()
            .PrimaryKey()
            .WithColumn("lastUpdateDate")
            .AsDate()
            .WithColumn("goodLastUpdateDate")
            .AsDate();
    }
}
