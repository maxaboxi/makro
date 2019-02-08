using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Makro.Models;
namespace Makro.DTO
{
    public class MealDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public List<Food> Foods { get; set; }

        public MealDto(string name)
        {
            Name = name;
            Foods = new List<Food>();
        }
    }
}
