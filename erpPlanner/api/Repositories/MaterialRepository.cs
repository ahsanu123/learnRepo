using Dapper;
using erpPlanner.Model;
using erpPlanner.Services;

namespace erpPlanner.Repository;

// most diference think about postgresql and sqlserver is, stored procedure in postgresql doesnt return a value or table
// but in sqlserver does.
//
// in postgresql need to use select to get table like value from function

public interface IMaterialRepository
{
    public Task<Component> GetMaterialById(int Id);
    public Task<IEnumerable<Component>> GetMaterial();
    public Task<IEnumerable<Component>> GetMaterialByProjectId(int Id);
}

public class MaterialRepository : IMaterialRepository
{
    private readonly PostgresqlConnectionProvider _connection;

    public MaterialRepository(PostgresqlConnectionProvider connection)
    {
        _connection = connection;
    }

    public async Task<IEnumerable<Component>> GetMaterial()
    {
        using (var conn = _connection.CreateConnection())
        {
            string sql = $"select * from GetMaterial();";
            var material = await conn.QueryAsync<Component>(sql);

            return material;
        }
    }

    public async Task<Component> GetMaterialById(int id)
    {
        using (var conn = _connection.CreateConnection())
        {
            string sql = $"select * from GetMaterialById({id});";
            var material = await conn.QueryFirstOrDefaultAsync<Component>(sql);

            return material;
        }
    }

    public async Task<IEnumerable<Component>> GetMaterialByProjectId(int Id)
    {
        using (var conn = _connection.CreateConnection())
        {
            string sql = $"select * from GetMaterialByProjectId({Id})";

            var projectMaterial = await conn.QueryAsync<Component>(sql);
            return projectMaterial;
        }
    }
}
