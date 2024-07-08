using Microsoft.Extensions.Logging;

namespace LearnQuart.Services;

public class CustomLogger : ILogger
{
    public IDisposable? BeginScope<TState>(TState state)
        where TState : notnull
    {
        return null;
    }

    public bool IsEnabled(LogLevel logLevel)
    {
        return logLevel != LogLevel.None;
    }

    public void Log<TState>(
        LogLevel logLevel,
        EventId eventId,
        TState state,
        Exception? exception,
        Func<TState, Exception?, string> formatter
    )
    {
        var logRecord = string.Format(
            "💠 {0} [{1}] {2} {3}",
            "[" + DateTimeOffset.UtcNow.ToString("MM/dd HH:mm:ss") + "]",
            logLevel.ToString().Substring(0, 4),
            formatter(state, exception),
            exception != null ? exception.StackTrace : ""
        );
        Console.WriteLine(logRecord);
    }
}
