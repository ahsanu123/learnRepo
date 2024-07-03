using System.Data.Common;
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

    public DbDataAdapter GetAdapter(string tableName, DbConnection connection)
    {
        string rawSelectCommand = $"select * from {tableName}";
        var selectCommand = new NpgsqlCommand(rawSelectCommand, (NpgsqlConnection)connection);

        return new NpgsqlDataAdapter(selectCommand);
    }
}
