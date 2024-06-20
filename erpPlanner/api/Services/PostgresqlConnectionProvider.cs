using Npgsql;

namespace erpPlanner.Services;

public class PostgresqlConnectionProvider
{
    private readonly IConfiguration _configuration;
    private readonly string _connectionString;

    public PostgresqlConnectionProvider(IConfiguration configuration)
    {
        _configuration = configuration;
        _connectionString = _configuration.GetConnectionString("postgresql");
    }

    public NpgsqlConnection CreateConnection()
    {
        return new NpgsqlConnection(_connectionString);
    }
}
