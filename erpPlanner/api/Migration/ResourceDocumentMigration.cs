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
            .WithColumn("Id")
            .AsInt32()
            .PrimaryKey()
            .Identity()
            .WithColumn("Overview")
            .AsString()
            .WithColumn("Description")
            .AsString();
    }

    public void SetupForeignKey(Migration migration) { }
}
