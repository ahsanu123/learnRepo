using FluentMigrator;

namespace erpPlanner.pMigration;
/*public int MaterialId { get; set; }*/
/*public string Name { get; set; }*/
/*public string Type { get; set; }*/
/*public string Category { get; set; }*/
/*public string Description { get; set; }*/
/*public float Price { get; set; }*/
/*public string Suplier { get; set; }*/
/*public string SuplerLink { get; set; }*/
/*public int StorageId { get; set; }*/

public class MaterialMigration : MigrationChild
{
    public void ChildDown(Migration migration)
    {
        migration.Delete.Table("material");
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
          .WithColumn("materialId").AsInt64().PrimaryKey().Identity()
          .WithColumn("price").AsFloat();

        foreach (var colName in stringCol)
        {
            table.WithColumn(colName).AsString();
        }
    }

}

public class HelloMigrator : MigrationChild
{
    public void ChildDown(Migration migration)
    {
        migration.Delete.Table("hello");
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

        var table = migration.Create.Table("hello")
          .WithColumn("materialId").AsInt64().PrimaryKey().Identity()
          .WithColumn("price").AsFloat();

        foreach (var colName in stringCol)
        {
            table.WithColumn(colName).AsString();
        }
    }

}




public class SometihnkMigration : MigrationChild
{
    public void ChildDown(Migration migration)
    {
        migration.Delete.Table("somethink");
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

        var table = migration.Create.Table("somethink")
          .WithColumn("materialId").AsInt64().PrimaryKey().Identity()
          .WithColumn("price").AsFloat();

        foreach (var colName in stringCol)
        {
            table.WithColumn(colName).AsString();
        }
    }

}



