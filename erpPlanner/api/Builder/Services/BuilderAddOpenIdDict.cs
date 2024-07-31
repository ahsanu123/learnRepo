using erpPlanner.pMigration;

namespace erpPlanner.BuilderService;

public static class OpenIdDictProvider
{
    public static IServiceCollection AddOpenIdDictProvider(this IServiceCollection services)
    {
        services
            .AddOpenIddict()
            .AddCore(option =>
            {
                option.UseEntityFrameworkCore().UseDbContext<ApplicationDbcontext>();
            })
            .AddServer(option =>
            {
                option.SetTokenEndpointUris("/connect/token");
                option.AllowClientCredentialsFlow();
                option.AddDevelopmentEncryptionCertificate().AddDevelopmentSigningCertificate();
                option.UseAspNetCore().EnableTokenEndpointPassthrough();
            });

        return services;
    }
}
