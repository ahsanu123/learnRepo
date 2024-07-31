using System.Reflection;
using FluentMigrator.Runner;

namespace erpPlanner.BuilderService;

public static class BuilderFluentMigratorProvider
{
    public static IServiceCollection AddFluentMigratorProvider(
        this IServiceCollection services,
        string connectionString
    )
    {
        services
            .AddFluentMigratorCore()
            .ConfigureRunner(rb =>
                rb
                // Add SQLite support to FluentMigrator
                // Set the connection string
                // .AddSQLite()
                // .AddSqlServer()
                .AddPostgres()
                    .WithGlobalConnectionString(connectionString)
                    .ScanIn(Assembly.GetExecutingAssembly())
                    .For.All()
            )
            // Enable logging to console in the FluentMigrator way
            .AddLogging(lb => lb.AddFluentMigratorConsole())
            .Configure<FluentMigratorLoggerOptions>(options =>
            {
                options.ShowSql = false;
                options.ShowElapsedTime = true;
            })
            // Build the service provider
            .BuildServiceProvider(false);
        return services;
    }
}
