using Newtonsoft.Json;
namespace Makro.Models
{
    public class SharedMealFood
    {
        public int Id { get; set; }
        public int FoodId { get; set; }
        public Food Food { get; set; }
        [JsonIgnore]
        public int SharedMealId { get; set; }
        [JsonIgnore]
        public SharedMeal SharedMeal { get; set; }
        public decimal FoodAmount { get; set; }
    }
}
