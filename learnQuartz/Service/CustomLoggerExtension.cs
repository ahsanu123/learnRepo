using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace LearnQuart.Services;

public static class CustomLoggerServiceExtension
{
    public static ILoggingBuilder AddCustomLogger(this ILoggingBuilder builder)
    {
        builder.Services.AddSingleton<ILoggerProvider, CustomLoggerProvider>();
        return builder;
    }
}
