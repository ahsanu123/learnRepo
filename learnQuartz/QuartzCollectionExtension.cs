using Quartz;

public static class QuartzCollectionExtension
{
    public static IServiceCollectionQuartzConfigurator AddQuartzJobCollection(
        this IServiceCollectionQuartzConfigurator quart
    )
    {
        var jobKey = new JobKey("HelloWorldJob");
        quart.AddJob<HelloWorld>(option => option.WithIdentity(jobKey));
        quart.AddTrigger(option =>
        {
            option.ForJob(jobKey);
            option.WithIdentity("HelloWorldJob-Trigger");
            option.WithCronSchedule("0/5 * * * * ?");
        });
        return quart;
    }
}
