using Makro.Models;
using System.Collections.Generic;
namespace Makro.Services
{
    public class MealService
    {
        public List<MealName> GenerateDefaultMeals()
        {
            return new List<MealName>
            {
                new MealName("Aamupala"), new MealName("Lounas"), new MealName("Välipala 1"), new MealName("Sali"), new MealName("Välipala 2"), new MealName("Iltapala")
            };
        }
    }
}
