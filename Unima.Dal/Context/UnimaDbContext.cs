using Microsoft.EntityFrameworkCore;
using Unima.Dal.Entities.Models.Support;

namespace Unima.Dal.Context;

public class UnimaDbContext : DbContext
{
    public UnimaDbContext(DbContextOptions<UnimaDbContext> options)
    : base(options)
    {

    }

    public DbSet<Support> Supports { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Support>().HasNoKey();

        base.OnModelCreating(modelBuilder);
    }
}
