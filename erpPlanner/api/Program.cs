using System.Reflection;
using erpPlanner.ExtensionMethod;
using FluentMigrator.Runner;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("postgresql");

// Add services to the container.
// add all service collection to Services
builder.Services.AddServiceCollectionExtension();
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
});

builder
    .Services.AddFluentMigratorCore()
    .ConfigureRunner(rb =>
        rb
        // Add SQLite support to FluentMigrator
        .AddPostgres()
            // Set the connection string
            .WithGlobalConnectionString(connectionString)
            // Define the assembly containing the migrations
            .ScanIn(Assembly.GetExecutingAssembly())
            .For.Migrations()
    )
    // Enable logging to console in the FluentMigrator way
    .AddLogging(lb => lb.AddFluentMigratorConsole())
    // Build the service provider
    .BuildServiceProvider(false);
;

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(option =>
    {
        option.EnableTryItOutByDefault();
    });
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
