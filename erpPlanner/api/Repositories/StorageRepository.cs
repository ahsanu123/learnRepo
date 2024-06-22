using Npgsql;
using Dapper;
using erpPlanner.Services;
using erpPlanner.Model;
using System.Data.Common;

namespace erpPlanner.Repository;

public interface IStorageRepository
{
    public Task<IEnumerable<Storage>> GetListStorage();
    public Task<Storage> GetStorage(int storageId);
    public Task<int> CreateStorage(Storage newStorage);
    public Task<Storage> UpdateStorage(Storage updatedStorage);
    public Task<int> deleteStorage(int storageId);
}

public class StorageRepository : IStorageRepository
{
    private readonly PostgresqlConnectionProvider _connection;
    public StorageRepository(PostgresqlConnectionProvider connection)
    {
        _connection = connection;
    }
    public async Task<int> CreateStorage(Storage newStorage)
    {
        string sql = @"
        INSERT INTO planerp_storage(name, location)
          VALUES (@name, @location) RETURNING storageid;";

        using (var conn = _connection.CreateConnection())
        {

            var id = await conn.ExecuteScalarAsync<int>(sql, new
            {
                name = newStorage.Name,
                location = newStorage.Location
            });
            return id;
        }
    }

    public async Task<int> deleteStorage(int storageId)
    {
        string sql = "DELETE FROM planerp_storage	WHERE storageid=@storageid;";
        using (var conn = _connection.CreateConnection())
        {
            var affectedRow = await conn.ExecuteAsync(sql, new
            {
                storageid = storageId
            });
            return affectedRow;
        }
    }

    public async Task<IEnumerable<Storage>> GetListStorage()
    {
        using (var conn = _connection.CreateConnection())
        {
            string sql = $"SELECT *	FROM planerp_storage;";
            var result = await conn.QueryAsync<Storage>(sql);
            return result;
        }
    }

    public async Task<Storage> GetStorage(int storageId)
    {
        using (var conn = _connection.CreateConnection())
        {
            string sql = $@"SELECT * FROM planerp_storage where storageid=@storageid;";
            var storage = await conn.QueryFirstOrDefaultAsync<Storage>(sql, new
            {
                storageid = storageId
            });
            return storage;
        }
    }

    public async Task<Storage> UpdateStorage(Storage updatedStorage)
    {
        using (var conn = _connection.CreateConnection())
        {
            string sql = @"
            UPDATE planerp_storage
              SET  name=@name, location=@location
              WHERE storageid = @storageid;
          ";

            await conn.ExecuteAsync(sql, new
            {
                name = updatedStorage.Name,
                location = updatedStorage.Location,
                storageid = updatedStorage.Id
            });

            var result = await conn.QuerySingleOrDefaultAsync<Storage>($"select * from planerp_storage where storageid = {updatedStorage.Id}");

            return result;
        }
    }
}
