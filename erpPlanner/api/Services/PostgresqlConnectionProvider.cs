

public class PostgresqlConnectionProvider
{
    private readonly IConfiguration _configuration;
    private readonly string _connectionString;

    public PostgresqlConnectionProvider(IConfiguration configuration)
    {
        _configuration = configuration;
        _connectionString = configuration.GetConnectionString("postgresql");
    }
}
