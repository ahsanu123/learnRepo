using System.Reactive.Linq;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Rxdot.Services;

var builder = Host.CreateApplicationBuilder();
builder.Services.AddHostedService<Main>();

var host = builder.Build();
host.Run();
await host.StopAsync(TimeSpan.Zero);
