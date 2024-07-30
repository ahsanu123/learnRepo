using System.Reflection;
using erpPlanner.ExtensionMethod;
using erpPlanner.Model;
using erpPlanner.pMigration;
using FluentMigrator.Runner;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;
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
            // .AddSQLite()
            .WithGlobalConnectionString(connectionString)
            // .WithGlobalConnectionString("Data Source=test.db;foreign keys=true;")
            // Define the assembly containing the migrations
            .ScanIn(Assembly.GetExecutingAssembly())
            .For.All()
    )
    // Enable logging to console in the FluentMigrator way
    .AddLogging(lb => lb.AddFluentMigratorConsole())
    .Configure<FluentMigratorLoggerOptions>(options =>
    {
        options.ShowSql = true;
        options.ShowElapsedTime = true;
    })
    // Build the service provider
    .BuildServiceProvider(false);

builder.Services.AddDbContext<ApplicationDbcontext>(option =>
    option.UseInMemoryDatabase("AppData")
);
builder
    .Services.AddIdentityApiEndpoints<CustomIdentityModel>(
        (config) =>
        {
            config.Password.RequiredUniqueChars = 0;
        }
    )
    .AddEntityFrameworkStores<ApplicationDbcontext>();

builder
    .Services.AddAuthentication()
    .AddGoogle(option =>
    {
        option.ClientId = configuration["Authentication:Google:ClientId"];
        option.ClientSecret = configuration["Authentication:Google:ClientSecret"];
    });
builder.Services.AddAuthorization();
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
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapGroup("identity").MapIdentityApi<CustomIdentityModel>();

// app.Migrate();
app.Run();

public partial class Program { }
