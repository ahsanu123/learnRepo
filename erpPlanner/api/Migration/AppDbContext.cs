using erpPlanner.Model;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace erpPlanner.pMigration;

public class ApplicationDbcontext : IdentityDbContext<CustomIdentityModel>
{
    public ApplicationDbcontext(DbContextOptions<ApplicationDbcontext> option)
        : base(option) { }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
    }
}
