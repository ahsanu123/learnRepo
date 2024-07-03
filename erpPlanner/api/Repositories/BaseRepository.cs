using System.Reflection;
using Dapper;
using Dapper.Contrib.Extensions;
using erpPlanner.Model;
using erpPlanner.Services;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Npgsql;

namespace erpPlanner.Repository;

// CRUD
// CREATE
// READ
// UPDATE
// DELETE

public interface BaseRepository<T>
    where T : BaseModel
{
    public Task<IEnumerable<T>> GetAll();
    public Task<T> GetById(int id);
    public Task<int> UpdateByModel(T model);
    public Task<int> AddByModel(T model);
    public Task<int> DeleteById(int id);
}

public class SqlCommandRepository
{
    private readonly PostgresqlConnectionProvider _connection;

    public SqlCommandRepository(PostgresqlConnectionProvider connection)
    {
        _connection = connection;
    }

    public async Task<IEnumerable<Storage>> GetAll()
    {
        var mockup = new List<Storage>();
        using (var conn = _connection.CreateConnection())
        {
            var adapter = _connection.GetAdapter("storage", conn);

            var result = await conn.QueryAsync<Storage>(adapter.SelectCommand.CommandText);
            Console.WriteLine(adapter.SelectCommand.CommandText);
            return result;
            // mockup.Add(
            //     new Storage()
            //     {
            //         Id = 1,
            //         Name = adapter.SelectCommand.CommandText,
            //         Location = "Bengkel1"
            //     }
            // );
        }
        // return Task<IEnumerable<Storage>>.Factory.StartNew(() => mockup.ToList());
    }
}

// case component
// case storage
public class PostgresRepository<T> : BaseRepository<T>
    where T : BaseModel
{
    private readonly PostgresqlConnectionProvider _connection;

    public PostgresRepository(PostgresqlConnectionProvider connection)
    {
        _connection = connection;
    }

    public async Task<int> AddByModel(T model)
    {
        using (var conn = _connection.CreateConnection())
        {
            var modelString = JsonConvert.SerializeObject(model);
            var idRemovedObj = JObject.Parse(modelString);
            idRemovedObj.Remove("Id");

            var param = new DynamicParameters();
            var whatObject = idRemovedObj.ToObject<object>();

            int i = 1;
            foreach (var prop in idRemovedObj)
            {
                param.Add($"@p{i}", prop.Value.ToObject<string>());
                i++;
            }

            var modelType = typeof(T);
            var adapter = _connection.GetAdapter(modelType.Name.ToLower(), conn);
            var builder = new NpgsqlCommandBuilder((NpgsqlDataAdapter)adapter);

            // Console.WriteLine(builder.GetInsertCommand().CommandText);

            var result = await conn.ExecuteAsync(builder.GetInsertCommand().CommandText, param);

            return result;
        }
    }

    public Task<int> DeleteById(int id)
    {
        throw new NotImplementedException();
    }

    public async Task<IEnumerable<T>> GetAll()
    {
        using (var conn = _connection.CreateConnection())
        {
            var modelType = typeof(T);
            var adapter = _connection.GetAdapter(modelType.Name.ToLower(), conn);

            var queryResult = await conn.QueryAsync<T>(adapter.SelectCommand.CommandText);
            return queryResult;
        }
    }

    public async Task<T> GetById(int id)
    {
        using (var conn = _connection.CreateConnection())
        {
            var modelType = typeof(T);
            var adapter = _connection.GetAdapter(modelType.Name.ToLower(), conn);
            string whereRawQuery = $"{adapter.SelectCommand.CommandText} where id = {id}";

            var queryResult = await conn.QueryFirstOrDefaultAsync<T>(whereRawQuery);
            return queryResult;
        }
    }

    public Task<int> UpdateByModel(T model)
    {
        throw new NotImplementedException();
    }
}
