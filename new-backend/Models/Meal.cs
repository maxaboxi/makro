using System.ComponentModel.DataAnnotations;
namespace Makro.Models
{
    public class Meal
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public User User { get; set; }

        public Meal(string name)
        {
            Name = name;
        }
    }
}
