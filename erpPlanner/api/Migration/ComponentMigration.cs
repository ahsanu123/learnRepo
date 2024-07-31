using erpPlanner.Model;
using FluentMigrator;

namespace erpPlanner.pMigration;

public class ComponentMigration : MigrationChild
{
    public void ChildDown(Migration migration)
    {
        migration.DeleteTableIfExists("component");
    }

    public void ChildUp(Migration migration)
    {
        migration
            .Create.Table("component")
            .WithColumn("id")
            .AsInt32()
            .Identity()
            .PrimaryKey()
            .WithColumn("storageId")
            .AsInt64()
            .WithColumn("name")
            .AsString()
            .WithColumn("sellPrice")
            .AsFloat()
            .WithColumn("capital")
            .AsFloat()
            .WithColumn("isAssembly")
            .AsBoolean()
            .WithColumn("description")
            .AsString();
    }

    public void SetupForeignKey(Migration migration) { }
}
