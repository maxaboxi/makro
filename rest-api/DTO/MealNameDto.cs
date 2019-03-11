using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using System.Collections.Generic;
namespace Makro.DTO
{
    public class MealNameDto
    {
        [Required]
        public string UUID { get; set; }
        [Required]
        public string Name { get; set; }
        public List<FoodDto> Foods { get; set; }
    }
}
