namespace erpPlanner.BuilderService;

public static class BuilderExternalIdentityProvider
{
    public static IServiceCollection AddExternalIdentityProvider(
        this IServiceCollection services,
        ConfigurationManager configuration
    )
    {
        services
            .AddAuthentication()
            .AddGoogle(option =>
            {
                option.ClientId = configuration["Authentication:Google:ClientId"];
                option.ClientSecret = configuration["Authentication:Google:ClientSecret"];
            });
        return services;
    }
}
