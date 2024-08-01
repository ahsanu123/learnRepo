using erpPlanner.Model;
using erpPlanner.pMigration;
using Microsoft.EntityFrameworkCore;

namespace erpPlanner.Repository;

public interface IGenericRepository<T>
    where T : BaseModel
{
    public Task<T> Add(T model);
    public Task<T> Update(T model);
    public Task<int> Delete(int id);
    public Task<IEnumerable<T>> GetAll();
    public Task<T> Get(int id);
}

public class GenericRepository<T> : IGenericRepository<T>
    where T : BaseModel
{
    private DbContext _context;

    public GenericRepository(MasterContext context)
    {
        _context = context;
    }

    public async Task<T> Add(T model)
    {
        if (model.Id != null)
            model.Id = null;
        await _context.AddAsync(model);
        await _context.SaveChangesAsync();
        return model;
    }

    public async Task<int> Delete(int id)
    {
        var entity = await _context.FindAsync<T>(id);
        if (entity == null)
        {
            return 0;
        }
        _context.Remove(entity);
        await _context.SaveChangesAsync();
        return id;
    }

    public async Task<T> Get(int id)
    {
        return await _context.FindAsync<T>(id);
    }

    public async Task<IEnumerable<T>> GetAll()
    {
        return _context.Set<T>().ToList();
    }

    public async Task<T> Update(T model)
    {
        var entity = await _context.FindAsync<T>(model.Id);

        if (entity == null)
        {
            await _context.AddAsync<T>(model);
            await _context.SaveChangesAsync();
            return model;
        }

        _context.Update(model);
        await _context.SaveChangesAsync();
        return model;
    }
}
