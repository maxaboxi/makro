using Microsoft.EntityFrameworkCore;
using Makro.Models;
namespace Makro.DB
{
    public class MakroContext : DbContext
    {
        public MakroContext(DbContextOptions<MakroContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Food> Foods { get; set; }
        public DbSet<Meal> Meals { get; set; }
        public DbSet<MealName> MealNames { get; set; }
        public DbSet<Day> Days { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<SharedDay> SharedDays { get; set; }
        public DbSet<SharedMeal> SharedMeals { get; set; }
        public DbSet<MealFood> MealFoods { get; set; }
        public DbSet<SharedMealFood> SharedMealFoods { get; set; }
        public DbSet<TrackedPeriod> TrackedPeriods { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username).IsUnique();
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email).IsUnique();
            modelBuilder.Entity<User>()
                .HasIndex(u => u.UUID).IsUnique();

            modelBuilder.Entity<Food>()
                .HasIndex(f => f.UUID).IsUnique();

            modelBuilder.Entity<Meal>()
                .HasIndex(e => e.UUID).IsUnique();

            modelBuilder.Entity<Day>()
                .HasMany(d => d.Meals);

            modelBuilder.Entity<Day>()
                .HasIndex(e => e.UUID).IsUnique();

            modelBuilder.Entity<MealName>()
                .HasIndex(e => e.UUID).IsUnique();

            modelBuilder.Entity<SharedDay>()
                .HasIndex(e => e.UUID).IsUnique();

            modelBuilder.Entity<SharedMeal>()
                .HasIndex(e => e.UUID).IsUnique();

            modelBuilder.Entity<Like>()
                .HasIndex(e => e.UUID).IsUnique();

            modelBuilder.Entity<Feedback>()
                .HasIndex(e => e.UUID).IsUnique();

            modelBuilder.Entity<TrackedPeriod>()
                .HasIndex(e => e.UUID).IsUnique();

            modelBuilder.Entity<TrackedPeriod>()
                .HasMany(e => e.Days);
        }
    }
}