using Microsoft.Extensions.Logging;

namespace LearnQuart.Services;

public class CustomLoggerProvider : ILoggerProvider
{
    public ILogger CreateLogger(string categoryName)
    {
        return new CustomLogger();
    }

    public void Dispose() { }
}
