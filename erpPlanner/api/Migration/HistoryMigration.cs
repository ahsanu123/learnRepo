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
            .WithColumn("Id")
            .AsInt32()
            .Identity()
            .PrimaryKey()
            .WithColumn("LastUpdateDate")
            .AsDate()
            .WithColumn("GoodLastUpdateDate")
            .AsDate();
    }

    public void SetupForeignKey(Migration migration) { }
}
