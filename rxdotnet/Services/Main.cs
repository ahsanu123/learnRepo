using Microsoft.Extensions.Hosting;
using Spectre.Console;

namespace Rxdot.Services;

public class Main : IHostedService, IAsyncDisposable
{
    public async ValueTask DisposeAsync() { }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        var table = new Table().Centered();

        await AnsiConsole
            .Live(table)
            .StartAsync(async ctx =>
            {
                table.AddColumn("Foo");
                ctx.Refresh();
                await Task.Delay(1000);

                table.AddColumn("Bar");
                ctx.Refresh();
                await Task.Delay(1000);
            });
    }

    public async Task StopAsync(CancellationToken cancellationToken)
    {
        Console.WriteLine("=============================");
        Console.WriteLine("Stopping");
        Console.WriteLine("=============================");
    }
}
