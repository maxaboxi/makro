using Microsoft.EntityFrameworkCore;
namespace Makro.Models
{
    public class MakroContext : DbContext
    {
        public MakroContext(DbContextOptions<MakroContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Food> Foods { get; set; }
        public DbSet<EditedFood> EditedFoods { get; set; }
        public DbSet<Meal> Meals { get; set; }
        public DbSet<MealName> MealNames { get; set; }
        public DbSet<Day> Days { get; set; }
        public DbSet<Article> Articles { get; set; }
        public DbSet<ArticleImage> ArticleImages { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<SharedDay> SharedDays { get; set; }
        public DbSet<SharedMeal> SharedMeals { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasMany(u => u.Meals)
                .WithOne(e => e.User);
            modelBuilder.Entity<User>()
                .HasIndex(u => new { u.Username }).IsUnique();
            modelBuilder.Entity<User>()
                .HasIndex(u => new { u.Email }).IsUnique();

            modelBuilder.Entity<Article>()
                .HasMany(a => a.Images)
                .WithOne(e => e.Article);
            modelBuilder.Entity<Article>()
                .HasMany(a => a.Comments)
                .WithOne(e => e.Article);

            modelBuilder.Entity<Answer>()
                .HasOne(e => e.Question)
                .WithMany(q => q.Answers);
            modelBuilder.Entity<Answer>()
                .HasMany(a => a.Comments)
                .WithOne(e => e.Answer);

        }
    }
}
