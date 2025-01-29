using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Unima.Dal.Entities;

namespace Unima.Dal.Identity.Context;

public class UnimaIdentityDbContext : IdentityDbContext<ApplicationUser>
{
    public UnimaIdentityDbContext(DbContextOptions<UnimaIdentityDbContext> options)
        : base(options)
    {

    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
        optionsBuilder.UseSqlServer("Server=localhost,1433;User Id=sa;Password=Str0ngP@ssword123;Database=UnimaDb;MultipleActiveResultSets=true;TrustServerCertificate=True\r\n");
    }
}
