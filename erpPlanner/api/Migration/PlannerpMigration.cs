using FluentMigrator;
using FluentMigrator.Runner;

namespace erpPlanner.Migration;
[Migration(1, "Plannerp Migration Version 1")]
public class StorageMigration : MigrationBase
{
    public override void Down()
    {
        throw new NotImplementedException();
    }


    /*public int? storageId { get; set; }*/
    /*public string name { get; set; }*/
    /*public string location { get; set; }*/
    public override void Up()
    {
        Create.Table("storage")
          .WithColumn("storageId").AsInt64().PrimaryKey().Identity()
          .WithColumn("name").AsString()
          .WithColumn("location").AsString();
    }
}

/*public int MaterialId { get; set; }*/
/*public string Name { get; set; }*/
/*public string Type { get; set; }*/
/*public string Category { get; set; }*/
/*public string Description { get; set; }*/
/*public float Price { get; set; }*/
/*public string Suplier { get; set; }*/
/*public string SuplerLink { get; set; }*/
/*public int StorageId { get; set; }*/
public class MaterialMigration : MigrationBase
{
    public override void Down()
    {
        throw new NotImplementedException();
    }

    public override void Up()
    {
        List<string> stringCol = new List<string>([
          "name",
          "type",
          "category",
          "description",
          "supplier",
          "supplierLink"
        ]);

        var table = Create.Table("material")
          .WithColumn("materialId").AsInt64().PrimaryKey().Identity();

        foreach (var colName in stringCol)
        {
            table.WithColumn(colName).AsString();
        }
    }
}

public static class MigrationExtension
{
    public static IApplicationBuilder Migrate(this IApplicationBuilder app)
    {
        using var scope = app.ApplicationServices.CreateScope();
        var runner = scope.ServiceProvider.GetService<IMigrationRunner>();
        runner.ListMigrations();
        runner.MigrateUp(1);

        return app;
    }
}


