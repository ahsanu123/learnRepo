using erpPlanner.Services;
using erpPlanner.Repository;

namespace erpPlanner.ExtensionMethod;

public static class ServiceCollectionCustom
{
    public static IServiceCollection AddServiceCollectionExtension(this IServiceCollection services)
    {
        services.AddSingleton<PostgresqlConnectionProvider>();
        services.AddScoped<IMaterialRepository, MaterialRepository>();
        services.AddScoped<IProjectRepository, ProjectRepository>();
        services.AddScoped<IProducingStepRepository, ProducingStepRepository>();
        services.AddScoped<IStorageRepository, StorageRepository>();
        services.AddScoped<IResourceDocRepository, ResourceDocRepository>();
        return services;
    }
}

