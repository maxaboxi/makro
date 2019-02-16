using Makro.Models;
using System.Collections.Generic;
using AutoMapper;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Makro.DTO;
using System;
using System.Linq;
namespace Makro.Services
{
    public class MealService
    {
        private readonly MakroContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger _logger;

        public MealService(MakroContext context, IMapper mapper, ILogger<MealService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<ActionResult<IEnumerable<SharedMealDto>>> GetAllSharedMeals()
        {
            List<SharedMeal> sharedMeals = await _context.SharedMeals
                .Include(m => m.User)
                .Include(m => m.SharedMealFoods)
                    .ThenInclude(mf => mf.Food)
                        .ThenInclude(f => f.User)
                .AsNoTracking()
                .ToListAsync();

            var sharedMealDtos = new List<SharedMealDto>();
           sharedMeals.ForEach(sm =>
            {
                var foodDtos = new List<FoodDto>();
                sm.SharedMealFoods.ToList().ForEach(e => foodDtos.Add(_mapper.Map<FoodDto>(e.Food)));
                var sharedMealDto = _mapper.Map<SharedMealDto>(sm);
                sharedMealDto.Foods = foodDtos;
                sharedMealDtos.Add(sharedMealDto);
            });

            return sharedMealDtos;
        }

        public async Task<ResultDto> AddNewSharedMeal(SharedMealDto sharedMealDto, User user)
        {
            List<Food> foods = MapFoodDtoListToFoodList(sharedMealDto.Foods);
            var sharedMeal = _mapper.Map<SharedMeal>(sharedMealDto);
            sharedMeal.UUID = Guid.NewGuid().ToString();
            sharedMeal.User = user;
            sharedMeal.CreatedAt = DateTime.Now;
            sharedMeal.UpdatedAt = DateTime.Now;
            await _context.AddAsync(sharedMeal);
            foods.ForEach(f => {
                var smf = new SharedMealFood
                {
                    Food = f,
                    SharedMeal = sharedMeal
                };
                _context.Add(smf);
            });
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Meal shared succesfully");
        }

        public async Task<ResultDto> UpdateSharedMeal(SharedMealDto sharedMealDto)
        {
            var sharedMeal = await _context.SharedMeals.Where(sm => sm.UUID == sharedMealDto.UUID).FirstOrDefaultAsync();

            if (sharedMeal == null)
            {
                _logger.LogDebug("SharedMeal not found with UUID: ", sharedMealDto.UUID);
                return new ResultDto(false, "Meal not found");
            }

            sharedMeal.Info = sharedMealDto.Info;
            sharedMeal.Name = sharedMealDto.Name;
            sharedMeal.Recipe = sharedMealDto.Recipe;
            sharedMeal.Tags = sharedMealDto.Tags;
            sharedMeal.UpdatedAt = DateTime.Now;

            List<Food> foods = MapFoodDtoListToFoodList(sharedMealDto.Foods);
            _context.SharedMealFoods.RemoveRange(_context.SharedMealFoods.Where(smf => smf.SharedMealId == sharedMeal.Id));
            foods.ForEach(f => {
                var smf = new SharedMealFood
                {
                    Food = f,
                    SharedMeal = sharedMeal
                };
                _context.Add(smf);
            });

            _context.Entry(sharedMeal).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Meal updated succesfully");
        }

        public async Task<ResultDto> DeleteSharedMeal(string id, string userId)
        {
            var sharedMeal = await _context.SharedMeals.Where(sm => sm.UUID == id).FirstOrDefaultAsync();


            if (sharedMeal == null)
            {
                _logger.LogDebug("SharedMeal not found with UUID: ", id);
                return new ResultDto(false, "Not found");
            }

            if (sharedMeal.User.UUID != userId)
            {
                _logger.LogError("User with UUID ", userId + " tried to delete food which belogs to " + sharedMeal.User.UUID);
                return new ResultDto(false, "Unauthorized");
            }

            _context.SharedMeals.Remove(sharedMeal);
            await _context.SaveChangesAsync();

            return new ResultDto(true, "Shared meal deleted succesfully");
        }

        public List<MealName> GenerateDefaultMealNamesForUser()
        {
            return new List<MealName>
            {
                new MealName("Aamupala"), new MealName("Lounas"), new MealName("Välipala 1"), new MealName("Sali"), new MealName("Välipala 2"), new MealName("Iltapala")
            };
        }

        private List<Food> MapFoodDtoListToFoodList(List<FoodDto> foodDtos)
        {
            List<Food> foods = new List<Food>();
            foodDtos.ForEach(f => foods.Add(_mapper.Map<Food>(f)));
            foods.ForEach(f => f.Id = _context.Foods.Where(food => food.UUID == f.UUID).FirstOrDefault().Id);
            return foods;
        }
    }
}
