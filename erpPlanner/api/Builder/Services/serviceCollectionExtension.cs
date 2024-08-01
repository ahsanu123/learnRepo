using erpPlanner.Model;
using erpPlanner.Repository;
using erpPlanner.Services;

namespace erpPlanner.BuilderService;

public static class ServiceCollectionCustom
{
    public static IServiceCollection AddServiceCollectionExtension(this IServiceCollection services)
    {
        services.AddSingleton<PostgresqlConnectionProvider>();
        services.AddScoped<SqlCommandRepository>();

        services.AddSingleton<FileUtilService>();
        services.AddScoped<BaseRepository<Storage>, PostgresRepository<Storage>>();
        services.AddScoped<IMaterialRepository, MaterialRepository>();
        services.AddScoped<IProjectRepository, ProjectRepository>();
        services.AddScoped<IProducingStepRepository, ProducingStepRepository>();
        services.AddScoped<IStorageRepository, StorageRepository>();
        services.AddScoped<IResourceDocRepository, ResourceDocRepository>();
        services.AddScoped<EFGenericCrud<Storage>>();

        return services;
    }
}
