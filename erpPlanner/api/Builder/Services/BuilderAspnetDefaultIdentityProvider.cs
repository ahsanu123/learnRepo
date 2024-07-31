using erpPlanner.Model;
using erpPlanner.pMigration;
using Microsoft.EntityFrameworkCore;

namespace erpPlanner.BuilderService;

public static class BuilderAspnetDefaultIdentityProvider
{
    // add default ui and identity provider from aspnet
    public static IServiceCollection AddAspNetDefaultIdentityProvider(
        this IServiceCollection services
    )
    {
        services
            .AddIdentityApiEndpoints<CustomIdentityModel>(
                (config) =>
                {
                    config.Password.RequiredUniqueChars = 0;
                }
            )
            .AddEntityFrameworkStores<ApplicationDbcontext>();

        return services;
    }
}
