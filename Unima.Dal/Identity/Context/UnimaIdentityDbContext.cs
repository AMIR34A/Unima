using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Unima.Dal.Entities;
using Unima.Dal.Entities.Entities;
using Unima.Dal.Entities.Identity.User;
using Unima.Dal.Entities.Models;

namespace Unima.Dal.Identity.Context;

public class UnimaIdentityDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, int>
{
    public DbSet<Support> Supports { get; set; }

    public DbSet<Food> Foods { get; set; }

    public DbSet<Plan> Plans { get; set; }

    public DbSet<SelfLocation> SelfLocations { get; set; }

    public DbSet<QuestionAndAnswer> QuestionAndAnswers { get; set; }

    public DbSet<ProfessorInformation> ProfessorsInformation { get; set; }

    public DbSet<Lesson> Lessons { get; set; }

    public DbSet<Schedule> Schedules { get; set; }

    public UnimaIdentityDbContext()
    {

    }

    public UnimaIdentityDbContext(DbContextOptions<UnimaIdentityDbContext> options)
        : base(options)
    {

    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
        optionsBuilder.UseSqlServer("Server=localhost,1433;User Id=sa;Password=Str0ngP@ssword123;Database=UnimaDb;MultipleActiveResultSets=true;TrustServerCertificate=True");
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Support>().HasNoKey();

        //modelBuilder.Entity<ApplicationUser>().HasMany(entity => entity.Foods)
        //    .WithMany(entity => entity.Users)
        //    .UsingEntity(
        //    "UserFoods",
        //    right => right.HasOne(typeof(Food)).WithMany().HasForeignKey("FoodId").HasPrincipalKey("Id"),
        //     left => left.HasOne(typeof(ApplicationUser)).WithMany().HasForeignKey("UserId").HasPrincipalKey("Id"),
        //     join => join.HasKey("UserId", "FoodId"));

        modelBuilder.Entity<UserFood>()
                    .HasKey(userFood => new { userFood.UserId, userFood.FoodId, userFood.SelfLocationId });

        modelBuilder.Entity<UserFood>()
                    .HasOne(userFood => userFood.User)
                    .WithMany(user => user.UserFoods)
                    .HasForeignKey(userFood => userFood.UserId);

        modelBuilder.Entity<UserFood>()
                    .HasOne(userFood => userFood.Food)
                    .WithMany(user => user.UserFoods)
                    .HasForeignKey(userFood => userFood.FoodId);

        modelBuilder.Entity<UserFood>()
                    .HasOne(userFood => userFood.SelfLocation)
                    .WithMany(user => user.UserFoods)
                    .HasForeignKey(userFood => userFood.SelfLocationId);

        modelBuilder.Entity<Plan>().HasMany(entity => entity.Users)
                    .WithOne(entity => entity.Plan)
                    .HasForeignKey("PlanId")
                    .IsRequired(false);

        modelBuilder.Entity<SelfLocation>().HasMany(entity => entity.Users)
                    .WithOne(entity => entity.DefaultSelfLocation)
                    .HasForeignKey(entity => entity.DefaultSelfLocationId)
                    .IsRequired(false);

        modelBuilder.Entity<ProfessorInformation>()
                    .HasOne(entity => entity.User)
                    .WithOne(entity => entity.ProfessorInformation)
                    .HasForeignKey<ProfessorInformation>();

        modelBuilder.Entity<Lesson>()
                    .HasKey(lesson => new { lesson.ProfessorId, lesson.No, lesson.GroupNo });

        modelBuilder.Entity<Lesson>()
                    .HasOne(entity => entity.Professor)
                    .WithMany(entity => entity.Lessons)
                    .HasForeignKey(entity => entity.ProfessorId)
                    .IsRequired(true);

        modelBuilder.Entity<Schedule>()
                    .HasKey(schedule => new { schedule.LessonProfessorId, schedule.WeekStatus, schedule.DayOfWeek, schedule.Period });

        modelBuilder.Entity<Schedule>()
                    .HasOne(entity => entity.Lesson)
                    .WithMany(entity => entity.Schedules)
                    .HasForeignKey(entity => new { entity.LessonProfessorId, entity.LessonNo, entity.LessonGroupNo })
                    .IsRequired(true);

        base.OnModelCreating(modelBuilder);
    }
}