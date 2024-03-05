using erpPlanner.Services;
using erpPlanner.Repository;

namespace erpPlanner.ExtensionMethod;

public static class ServiceCollectionCustom
{
    public static IServiceCollection AddServiceCollectionExtension(this IServiceCollection services)
    {
        services.AddSingleton<PostgresqlConnectionProvider>();
        services.AddScoped<IMaterialRepository, MaterialRepository>();
        return services;
    }
}

