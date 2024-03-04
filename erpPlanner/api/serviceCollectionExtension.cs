
public static class ServiceCollection
{
    static void addServiceCollectionExtension(this IServiceCollection services)
    {
        services.AddSingleton<PostgresqlConnectionProvider>();
    }
}

