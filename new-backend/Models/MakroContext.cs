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
        public DbSet<Meal> Meals { get; set; }
    }
}
