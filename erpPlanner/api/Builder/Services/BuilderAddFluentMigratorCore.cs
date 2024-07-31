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
                .AddPostgres()
                    // Set the connection string
                    // .AddSQLite()
                    .WithGlobalConnectionString(connectionString)
                    // .WithGlobalConnectionString("Data Source=test.db;foreign keys=true;")
                    // Define the assembly containing the migrations
                    .ScanIn(Assembly.GetExecutingAssembly())
                    .For.All()
            )
            // Enable logging to console in the FluentMigrator way
            .AddLogging(lb => lb.AddFluentMigratorConsole())
            .Configure<FluentMigratorLoggerOptions>(options =>
            {
                options.ShowSql = true;
                options.ShowElapsedTime = true;
            })
            // Build the service provider
            .BuildServiceProvider(false);
        return services;
    }
}
