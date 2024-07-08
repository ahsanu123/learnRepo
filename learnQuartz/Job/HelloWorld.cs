using Microsoft.Extensions.Logging;
using Quartz;

[DisallowConcurrentExecution]
public class HelloWorld : IJob
{
    private readonly ILogger<HelloWorld> _logger;

    public HelloWorld(ILogger<HelloWorld> logger)
    {
        _logger = logger;
    }

    public Task Execute(IJobExecutionContext context)
    {
        _logger.LogInformation("hell yeah!!");
        return Task.CompletedTask;
    }
}
