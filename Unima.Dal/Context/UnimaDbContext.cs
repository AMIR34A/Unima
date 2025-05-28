//using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
//using Microsoft.EntityFrameworkCore;
//using Unima.Dal.Entities;
//using Unima.Dal.Entities.Models;
//using Unima.Dal.Entities.Models.Support;

//namespace Unima.Dal.Context;

//public class UnimaDbContext : IdentityDbContext<ApplicationUser>
//{
//    public UnimaDbContext(DbContextOptions<UnimaDbContext> options)
//    : base(options)
//    {

//    }

//    public DbSet<Support> Supports { get; set; }

//    public DbSet<Food> Foods { get; set; }

//    public DbSet<Plan> Plans { get; set; }

//    protected override void OnModelCreating(ModelBuilder modelBuilder)
//    {
//        modelBuilder.Entity<Support>().HasNoKey();

//        modelBuilder.Entity<ApplicationUser>().HasMany(entity => entity.Foods)
//            .WithMany(entity => entity.Users)
//            .UsingEntity(
//            "UserFoods",
//            right => right.HasOne(typeof(Food)).WithMany().HasForeignKey("FoodId").HasPrincipalKey("Id"),
//             left => left.HasOne(typeof(ApplicationUser)).WithMany().HasForeignKey("UserId").HasPrincipalKey("Id"),
//             join => join.HasKey("UserId", "FoodId"));

//        modelBuilder.Entity<Plan>().HasMany(entity => entity.Users)
//            .WithOne(entity => entity.Plan)
//            .HasForeignKey("PlanId")
//            .IsRequired(false);

//        base.OnModelCreating(modelBuilder);
//    }
//}
