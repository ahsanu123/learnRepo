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
        List<string> stringCol = new List<string>(
            ["name", "type", "category", "description", "supplier", "supplierLink"]
        );

        migration.GenerateFromObject(new Component());

        // migration
        //     .Create.Table("component")
        //     .WithColumn("id")
        //     .AsInt32()
        //     .Identity()
        //     .PrimaryKey()
        //     .WithColumn("storageId")
        //     .AsInt64()
        //     .WithColumn("name")
        //     .AsString()
        //     .WithColumn("sellPrice")
        //     .AsFloat()
        //     .WithColumn("capital")
        //     .AsFloat()
        //     .WithColumn("isAssembly")
        //     .AsBoolean()
        //     .WithColumn("description")
        //     .AsString();
    }
}
