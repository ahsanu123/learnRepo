using Dapper;
using erpPlanner.Model;
using erpPlanner.Services;

namespace erpPlanner.Repository;

public interface IResourceDocRepository
{
    public Task<ResourceDoc> GetResourceDocsById(int resourceDocId);
    public Task<IEnumerable<ResourceDoc>> GetResourceDocs();
    public Task<int> CreateResourceDoc(ResourceDoc newResourceDoc);
    public Task<ResourceDoc> UpdateResourceDoc(ResourceDoc updatedResourceDoc);
    public Task<int> deleteResourceDoc(int resourceDocId);
}

public class ResourceDocRepository { }
