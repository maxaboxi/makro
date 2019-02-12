using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System;
namespace Makro.Models
{
    public class Meal
    {
        public int Id { get; set; }
        [Required]
        public string UUID { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public User User { get; set; }
        [Required]
        public ICollection<Food> Foods { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
