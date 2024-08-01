using erpPlanner.Model;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace erpPlanner.pMigration;

public class MasterContext : IdentityDbContext<CustomIdentityModel>
{
    public MasterContext(DbContextOptions<MasterContext> option)
        : base(option) { }

    public DbSet<Storage> storage { get; set; }
}
