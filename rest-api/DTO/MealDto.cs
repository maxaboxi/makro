using System;
using System.Collections.Generic;
namespace Makro.DTO
{
    public class MealDto
    {
        public string UUID { get; set; }
        public int Index { get; set; }
        public string Name { get; set; }
        public string UserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<FoodDto> Foods { get; set; }
    }
}
