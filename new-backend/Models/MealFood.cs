﻿using Newtonsoft.Json;
namespace Makro.Models
{
    public class MealFood
    {
        public int Id { get; set; }
        [JsonIgnore]
        public int MealId { get; set; }
        [JsonIgnore]
        public Meal Meal { get; set; }
        public int FoodId { get; set; }
        public Food Food { get; set; }
    }
}
