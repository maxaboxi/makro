using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Makro.Models;
namespace Makro.DTO
{
    public class DayDto
    {
        public string UUID { get; set; }
        [Required]
        public string UserId { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public ICollection<Meal> Meals { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
