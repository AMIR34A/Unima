using Microsoft.EntityFrameworkCore;
using Unima.Dal.Entities;
using Unima.Dal.Entities.Models;
using Unima.Dal.Entities.Models.Support;

namespace Unima.Dal.Context;

public class UnimaDbContext : DbContext
{
    public UnimaDbContext(DbContextOptions<UnimaDbContext> options)
    : base(options)
    {

    }

    public DbSet<Support> Supports { get; set; }

    public DbSet<Food> Foods { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Support>().HasNoKey();

        modelBuilder.Entity<ApplicationUser>().HasMany(entity => entity.Foods)
            .WithMany(entity => entity.Users)
            .UsingEntity(
            "UserFoods",
            right => right.HasOne(typeof(Food)).WithMany().HasForeignKey("FoodId").HasPrincipalKey("Id"),
             left => left.HasOne(typeof(ApplicationUser)).WithMany().HasForeignKey("UserId").HasPrincipalKey("Id"),
             join => join.HasKey("UserId", "FoodId"));

        base.OnModelCreating(modelBuilder);
    }
}
