using System.Collections.Generic;
using System;
namespace Makro.DTO
{
    public class SharedMealDto
    {
        public string UUID { get; set; }
        public string Name { get; set; }
        public string Info { get; set; }
        public string Recipe { get; set; }
        public string AddedBy { get; set; }
        public string AddedByName { get; set; }
        public List<string> Tags { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int TotalPoints { get; set; }
        public int UserLike { get; set; }
        public List<FoodDto> Foods { get; set; }

    }
}
