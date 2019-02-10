using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
namespace Makro.Models
{
    public class SharedMeal
    {
        public int Id { get; set; }
        [Required]
        public User User { get; set; }
        [Required]
        public Meal Meal { get; set; }
        [Required]
        public List<string> Tags { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
