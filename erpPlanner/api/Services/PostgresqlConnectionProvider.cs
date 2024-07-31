using System.Data.Common;
using System.Data.SqlClient;
using Npgsql;

namespace erpPlanner.Services;

public interface IConnectionProvider
{
    public SqlConnection CreateConnection();
    public SqlDataAdapter GetAdapter(string tableName, DbConnection connection, bool isOnlyId);
}

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

    public DbDataAdapter GetAdapter(
        string tableName,
        DbConnection connection,
        bool isOnlyId = false
    )
    {
        string rawSelectCommand = isOnlyId
            ? rawSelectCommand = $"select id from {tableName}"
            : $"select * from {tableName}";

        var selectCommand = new NpgsqlCommand(rawSelectCommand, (NpgsqlConnection)connection);

        return new NpgsqlDataAdapter(selectCommand);
    }
}
