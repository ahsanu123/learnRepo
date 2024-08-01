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
            .WithColumn("Id")
            .AsInt32()
            .Identity()
            .PrimaryKey()
            .WithColumn("StorageId")
            .AsInt64()
            .Nullable()
            .WithColumn("Name")
            .AsString()
            .WithColumn("Price")
            .AsFloat()
            .WithColumn("Capital")
            .AsFloat()
            .WithColumn("Category")
            .AsString()
            .WithColumn("Type")
            .AsString()
            .WithColumn("Supplier")
            .AsString()
            .WithColumn("SupplierLink")
            .AsString()
            .WithColumn("IsAssembly")
            .AsBoolean()
            .WithColumn("Description")
            .AsString();
    }

    public void SetupForeignKey(Migration migration)
    {
        migration
            .Create.ForeignKey()
            .FromTable("component")
            .ForeignColumn("StorageId")
            .ToTable("storage")
            .PrimaryColumn("Id");
    }
}
