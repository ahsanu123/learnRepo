using FluentMigrator;

namespace erpPlanner.pMigration;

public class ResourceDocumentMigration : MigrationChild
{
    public void ChildDown(Migration migration)
    {
        migration.DeleteTableIfExists("resourceDocument");
    }

    public void ChildUp(Migration migration)
    {
        migration
            .Create.Table("resourceDocument")
            .WithColumn("id")
            .AsInt32()
            .PrimaryKey()
            .Identity()
            .WithColumn("overview")
            .AsString()
            .WithColumn("description")
            .AsString();
    }

    public void SetupForeignKey(Migration migration) { }
}
