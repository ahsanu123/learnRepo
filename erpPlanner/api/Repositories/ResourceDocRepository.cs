using Dapper;
using erpPlanner.Services;
using erpPlanner.Model;

namespace erpPlanner.Repository;

public interface IResourceDocRepository
{
    public Task<ResourceDoc> GetResourceDocsById(int resourceDocId);
    public Task<IEnumerable<ResourceDoc>> GetResourceDocs();
    public Task<int> CreateResourceDoc(ResourceDoc newResourceDoc);
    public Task<ResourceDoc> UpdateResourceDoc(ResourceDoc updatedResourceDoc);
    public Task<int> deleteResourceDoc(int resourceDocId);
}

public class ResourceDocRepository : IResourceDocRepository
{
    private readonly PostgresqlConnectionProvider _connection;
    public ResourceDocRepository(PostgresqlConnectionProvider connection)
    {
        _connection = connection;
    }

    public async Task<int> CreateResourceDoc(ResourceDoc newResourceDoc)
    {
        using (var conn = _connection.CreateConnection())
        {
            string sql = @"
            INSERT INTO planerp_resource_doc(
            materialid, url, description, title)
            VALUES (@materialid, @url, @description, @title) RETURNING resourcedocid;";

            var resultId = await conn.ExecuteScalarAsync<int>(sql, new
            {
                materialid = newResourceDoc.MaterialId,
                url = newResourceDoc.Url,
                description = newResourceDoc.Description,
                title = newResourceDoc.Title
            });
            return resultId;
        }
    }

    public async Task<int> deleteResourceDoc(int resourceDocId)
    {
        using (var conn = _connection.CreateConnection())
        {
            string sql = @"DELETE FROM planerp_resource_doc	WHERE resourceDocId = @resourceDocId;";

            var affectedRow = await conn.ExecuteScalarAsync<int>(sql, new
            {
                resourceDocId = resourceDocId,
            });
            return affectedRow;
        }
    }

    public async Task<ResourceDoc> GetResourceDocsById(int resourceDocId)
    {
        using (var conn = _connection.CreateConnection())
        {
            string sql = "SELECT * FROM planerp_resource_doc WHERE resourceDocId = @resourceDocId;";

            var resourceDoc = await conn.QuerySingleOrDefaultAsync<ResourceDoc>(sql, new
            {
                resourceDocId = resourceDocId,
            });
            return resourceDoc;
        }
    }

    public async Task<IEnumerable<ResourceDoc>> GetResourceDocs()
    {
        using (var conn = _connection.CreateConnection())
        {
            string sql = "SELECT * FROM planerp_resource_doc ";

            var listResourceDoc = await conn.QueryAsync<ResourceDoc>(sql);
            return listResourceDoc;
        }
    }


    public async Task<ResourceDoc> UpdateResourceDoc(ResourceDoc updatedResourceDoc)
    {
        using (var conn = _connection.CreateConnection())
        {
            string sql = @"
              UPDATE planerp_resource_doc
              SET url=@url, description=@description, title=@title
              WHERE resourceDocId = @resourceDocId AND materialId = @materialId;";

            await conn.ExecuteAsync(sql, new
            {
                url = updatedResourceDoc.Url,
                description = updatedResourceDoc.Description,
                title = updatedResourceDoc.Title,
                resourceDocId = updatedResourceDoc.Id,
                materialId = updatedResourceDoc.MaterialId,
            });

            sql = @"SELECT * from planerp_resource_doc WHERE resourceDocId =  @resourceDocId";

            var resultDoc = await conn.QuerySingleOrDefaultAsync<ResourceDoc>(sql, new
            {
                resourceDocId = updatedResourceDoc.Id,
            });

            return resultDoc;
        }
    }
}
