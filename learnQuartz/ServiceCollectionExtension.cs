using Microsoft.Extensions.DependencyInjection;
using Quartz;

namespace LearnQuart.ServiceExtension;

public static class ServiceCollectionExtension
{
    public static IServiceCollection AddServiceCollection(this IServiceCollection service)
    {
        service.AddQuartz(q =>
        {
            // Register all job collection from extension method
            q.AddQuartzJobCollection();
        });

        service.AddQuartzHostedService(option =>
        {
            option.WaitForJobsToComplete = true;
        });

        return service;
    }
}
