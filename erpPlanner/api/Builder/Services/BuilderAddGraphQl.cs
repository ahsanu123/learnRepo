using GraphQL.AspNet.Configuration;

namespace erpPlanner.BuilderService;

public static class BuilderAddGraphQLProvider
{
    public static IServiceCollection AddGraphQLProvider(this IServiceCollection services)
    {
        services.AddGraphQL(option => { });
        return services;
    }

    public static IApplicationBuilder UseGraphQlProvider(this IApplicationBuilder builder)
    {
        builder.UseGraphQL();
        builder.UseGraphQLVoyager("/graphql-ui/voyager");
        builder.UseGraphQLAltair("/graphql-ui/altair");
        return builder;
    }
}
