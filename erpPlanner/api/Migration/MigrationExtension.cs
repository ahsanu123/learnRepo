using FluentMigrator;
using FluentMigrator.Runner;

namespace erpPlanner.pMigration;

public interface MigrationChild
{
    public abstract void ChildUp(Migration migration);
    public abstract void ChildDown(Migration migration);
}

public static class MigrationExtension
{
    public const int MIGRATION_VERSION = 1;
    public const string MIGRATION_DESCRIPTION = "Plannerp Migration Version 1";

    public static IApplicationBuilder Migrate(this IApplicationBuilder app)
    {
        using var scope = app.ApplicationServices.CreateScope();
        var runner = scope.ServiceProvider.GetService<IMigrationRunner>();
        runner.ListMigrations();
        runner.MigrateUp(1);

        return app;
    }
}
