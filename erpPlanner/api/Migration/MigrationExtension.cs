using System.Reflection;
using FluentMigrator;
using FluentMigrator.Runner;

namespace erpPlanner.pMigration;

public interface MigrationChild
{
    public abstract void ChildUp(Migration migration);
    public abstract void ChildDown(Migration migration);
    public abstract void SetupForeignKey(Migration migration);
}

public static class MigrationExtension
{
    public const int MIGRATION_VERSION = 17;
    public const string MIGRATION_DESCRIPTION = $"Plannerp Migration Version 7";

    public static IApplicationBuilder Migrate(this IApplicationBuilder app)
    {
        using var scope = app.ApplicationServices.CreateScope();
        var runner = scope.ServiceProvider.GetService<IMigrationRunner>();
        var versionLoader = scope.ServiceProvider.GetService<IVersionLoader>();

        runner.ListMigrations();

        if (MigrationExtension.MIGRATION_VERSION > versionLoader.VersionInfo.Latest())
        {
            runner.Down(new MainMigrator());
            runner.MigrateUp(MigrationExtension.MIGRATION_VERSION);
        }

        return app;
    }

    public static Migration DeleteTableIfExists(this Migration migration, string name)
    {
        if (migration.Schema.Table(name).Exists())
            migration.Delete.Table(name);

        return migration;
    }

    public static Migration GenerateFromObject(this Migration migration, object model)
    {
        var listProperties = model.GetType().GetProperties();
        string tableName = model.GetType().Name;

        var table = migration.Create.Table(tableName);
        foreach (var properties in listProperties)
        {
            string name = properties.Name;
            bool isId = name == "Id";
            bool isForeign = name.Contains("Id") && !isId;
            string varType = properties.PropertyType.ToString().Split(".").Last().ToLower();
            bool nullable =
                new NullabilityInfoContext().Create(properties).WriteState
                == NullabilityState.Nullable;

            if (isId)
            {
                table.WithColumn(name).AsInt32().Identity().PrimaryKey();
                continue;
            }
            else if (varType.Contains("string"))
            {
                var column = table.WithColumn(name).AsString();
                if (nullable)
                    column.Nullable();
                continue;
            }
            else if (varType.Contains("int"))
            {
                var column = table.WithColumn(name).AsInt32();
                if (nullable)
                    column.Nullable();
                continue;
            }
            else if (varType.Contains("single"))
            {
                var column = table.WithColumn(name).AsFloat();
                if (nullable)
                    column.Nullable();
                continue;
            }

            // Console.WriteLine(
            //     $"{name} "
            //         + (isId ? " Is Id " : "")
            //         + (isForeign ? " Is Foreign " : "")
            //         + $" Type {varType} "
            //         + (nullable ? " is nullable " : " not Nullable")
            // );
        }
        return migration;
    }
}
