using erpPlanner.pMigration;
using Microsoft.EntityFrameworkCore;

namespace erpPlanner.Repository;

public interface IGenericCrud<T>
{
    public Task<T> Add(T model);
}

public class EFGenericCrud<T> : IGenericCrud<T>
{
    private DbContext _context;

    public EFGenericCrud(MasterContext context)
    {
        _context = context;
    }

    public async Task<T> Add(T model)
    {
        await _context.AddAsync(model);
        await _context.SaveChangesAsync();
        return model;
    }
}
