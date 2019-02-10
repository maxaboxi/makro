using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
namespace Makro.Models
{
    public class SharedDay
    {
        public int Id { get; set; }
        [Required]
        public User User { get; set; }
        [Required]
        public ICollection<Meal> Meals { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
