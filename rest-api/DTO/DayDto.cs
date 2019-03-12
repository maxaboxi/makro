using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
namespace Makro.DTO
{
    public class DayDto
    {
        public string UUID { get; set; }
        public string UserId { get; set; }
        public string Username { get; set; }
        [Required]
        public string Name { get; set; }
        public List<MealDto> AllMeals { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
