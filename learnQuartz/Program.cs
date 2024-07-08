using LearnQuart.ServiceExtension;
using LearnQuart.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

var builder = Host.CreateApplicationBuilder(args);

builder.Services.AddServiceCollection();
builder.Logging.ClearProviders();
builder.Logging.AddCustomLogger();

if (builder.Environment.IsDevelopment())
{
    Console.WriteLine("🍺 Start In Development..");
}

using (var host = builder.Build())
{
    var lifetime = host.Services.GetRequiredService<IHostApplicationLifetime>();

    lifetime.ApplicationStarted.Register(() =>
    {
        Console.WriteLine("🍛 Console Application Started..");
    });

    lifetime.ApplicationStopping.Register(() =>
    {
        Console.WriteLine("🍚 Stopping Console Application");
    });

    lifetime.ApplicationStopped.Register(() =>
    {
        Console.WriteLine("🥚 Console Application Stoped");
    });

    await host.StartAsync();
    await host.WaitForShutdownAsync();
}
