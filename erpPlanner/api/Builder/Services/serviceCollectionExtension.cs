using erpPlanner.Model;
using erpPlanner.Repository;
using erpPlanner.Services;

namespace erpPlanner.BuilderService;

public static class ServiceCollectionCustom
{
    public static IServiceCollection AddServiceCollectionExtension(this IServiceCollection services)
    {
        services.AddSingleton<PostgresqlConnectionProvider>();
        services.AddSingleton<FileUtilService>();

        services.AddScoped<GenericRepository<Storage>>();
        services.AddScoped<GenericRepository<Project>>();
        services.AddScoped<GenericRepository<Component>>();
        services.AddScoped<GenericRepository<ResourceDoc>>();
        services.AddScoped<GenericRepository<ProducingStep>>();

        return services;
    }
}
