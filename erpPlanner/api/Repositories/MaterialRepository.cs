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
    public Task<Material> GetMaterialById(int Id);
    public Task<IEnumerable<Material>> GetMaterial();
    public Task<IEnumerable<Material>> GetMaterialByProjectId(int Id);
}

public class MaterialRepository : IMaterialRepository
{
    private readonly PostgresqlConnectionProvider _connection;
    public MaterialRepository(PostgresqlConnectionProvider connection)
    {
        _connection = connection;
    }

    public async Task<IEnumerable<Material>> GetMaterial()
    {
        using (var conn = _connection.CreateConnection())
        {
            string sql = $"select * from GetMaterial();";
            var material = await conn.QueryAsync<Material>(sql);

            return material;
        }
    }

    public async Task<Material> GetMaterialById(int id)
    {

        using (var conn = _connection.CreateConnection())
        {
            string sql = $"select * from GetMaterialById({id});";
            var material = await conn.QueryFirstOrDefaultAsync<Material>(sql);

            return material;
        }
    }


    public async Task<IEnumerable<Material>> GetMaterialByProjectId(int Id)
    {
        using (var conn = _connection.CreateConnection())
        {
            string sql = $"select * from GetMaterialByProjectId({Id})";

            var projectMaterial = await conn.QueryAsync<Material>(sql);
            return projectMaterial;
        }
    }
}
