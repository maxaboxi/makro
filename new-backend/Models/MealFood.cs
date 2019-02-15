using Newtonsoft.Json;
namespace Makro.Models
{
    public class MealFood
    {
        [JsonIgnore]
        public int MealId { get; set; }
        [JsonIgnore]
        public Meal Meal { get; set; }
        public int FoodId { get; set; }
        public Food Food { get; set; }
        public int Id { get; set; }
    }
}
