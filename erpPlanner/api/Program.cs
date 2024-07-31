using erpPlanner.BuilderService;
using erpPlanner.ExtensionMethod;
using erpPlanner.Model;
using erpPlanner.pMigration;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;
var postgresConnectionString = builder.Configuration.GetConnectionString("postgresql");
var sqliteConnectionString = builder.Configuration.GetConnectionString("sqlite");
var sqlserverConnectionString = builder.Configuration.GetConnectionString("sqlserver");

//==================================================
//
//  Configure Builder
//
//==================================================

builder.Services.AddServiceCollectionExtension();
builder.Services.AddControllers();
builder.Services.AddAuthorization();

builder.Services.AddDbContext<ApplicationDbcontext>(option =>
{
    option.UseInMemoryDatabase("AppData");
    option.UseOpenIddict();
});

builder.Services.AddSwaggerUI();
builder.Services.AddFluentMigratorProvider(sqliteConnectionString);
builder.Services.AddAspNetDefaultIdentityProvider();
builder.Services.AddExternalIdentityProvider(configuration);
builder.Services.AddOpenIdDictProvider();

builder.Services.AddHostedService<OpendIddictWorker>();

//==================================================
//
//  Application Start
//
//==================================================


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
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

app.Migrate();
app.Run();

public partial class Program { }
