using Dapper;
using erpPlanner.Model;
using erpPlanner.Services;

namespace erpPlanner.Repository;

public interface IComponentRepository
{
    public Task<Component> GetMaterialById(int Id);
    public Task<IEnumerable<Component>> GetMaterial();
    public Task<IEnumerable<Component>> GetMaterialByProjectId(int Id);
}
