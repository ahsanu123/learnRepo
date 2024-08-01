using erpPlanner.pMigration;
using Microsoft.EntityFrameworkCore;

namespace erpPlanner.BuilderService;

public static class NpgSqlDbProvider
{
    public static IServiceCollection AddPostgresqlDbProvider(
        this IServiceCollection services,
        string connectionString
    )
    {
        services.AddDbContext<MasterContext>(option =>
        {
            option.UseNpgsql(connectionString);
            option.EnableSensitiveDataLogging();
            option.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
        });
        return services;
    }
}
