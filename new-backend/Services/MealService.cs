using Makro.Models;
using System.Collections.Generic;
using Makro.DTO;
namespace Makro.Services
{
    public class MealService
    {
        private readonly MakroContext _context;
        public MealService(MakroContext makroContext)
        {
            _context = makroContext;
        }

        public List<Meal> GenerateDefaultMeals()
        {
            return new List<Meal>
            {
                new Meal("Aamupala"), new Meal("Lounas"), new Meal("Välipala 1"), new Meal("Sali"), new Meal("Välipala 2"), new Meal("Iltapala")
            };
        }

        public List<MealDto> ConvertToMealDto(List<Meal> meals)
        {
            var mealDtos = new List<MealDto>();
            meals.ForEach(m => mealDtos.Add(new MealDto(m.Name)));
            return mealDtos;
        }
    }
}
