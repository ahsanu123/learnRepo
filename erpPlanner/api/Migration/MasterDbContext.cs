using erpPlanner.Model;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace erpPlanner.pMigration;

public class MasterContext : IdentityDbContext<CustomIdentityModel>
{
    public MasterContext(DbContextOptions<MasterContext> option)
        : base(option) { }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(
            "Host=localhost;Port=5432;Username=ah;Password=;Database=planerp;"
        );
    }

    public DbSet<Storage> storage { get; set; }
}
