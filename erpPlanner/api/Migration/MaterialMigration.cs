using FluentMigrator;

namespace erpPlanner.pMigration;

public class MaterialMigration : MigrationChild
{
    public void ChildDown(Migration migration)
    {
        migration.DeleteTableIfExists("material");
    }

    public void ChildUp(Migration migration)
    {
        List<string> stringCol = new List<string>([
          "name",
          "type",
          "category",
          "description",
          "supplier",
          "supplierLink"
        ]);

        var table = migration.Create.Table("material")
          .WithColumn("id").AsInt64().PrimaryKey().Identity()
          .WithColumn("price").AsFloat();

        foreach (var colName in stringCol)
        {
            table.WithColumn(colName).AsString();
        }

        migration.Create.ForeignKey()
          .FromTable("material").ForeignColumn("storageId")
          .ToTable("storage").PrimaryColumn("id");

    }

}

