using Makro.DB;
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
        private readonly FoodService _foodService;

        public MealService(MakroContext context, IMapper mapper, ILogger<MealService> logger, FoodService foodService)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
            _foodService = foodService;
        }

        public async Task<ActionResult<IEnumerable<SharedMealDto>>> GetAllSharedMeals(string userId)
        {
            List<SharedMeal> sharedMeals = await _context.SharedMeals.Where(sm => sm.Shared)
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
                sm.SharedMealFoods.ToList().ForEach(e => {
                    var foodDto = _mapper.Map<FoodDto>(e.Food);
                    foodDto.Amount = e.FoodAmount;
                    foodDto.Energy *= (foodDto.Amount / 100);
                    foodDto.Protein *= (foodDto.Amount / 100);
                    foodDto.Carbs *= (foodDto.Amount / 100);
                    foodDto.Fat *= (foodDto.Amount / 100);
                    foodDto.Sugar *= (foodDto.Amount / 100);
                    foodDto.Fiber *= (foodDto.Amount / 100);
                    foodDtos.Add(foodDto);
                 });
                var sharedMealDto = _mapper.Map<SharedMealDto>(sm);
                var totalPoints = 0;
                var likes = _context.Likes.Where(l => l.SharedMeal == sm).Include(l => l.User).ToList();
                likes.ForEach(like => {
                    totalPoints += like.Value;
                    if (like.User.UUID == userId)
                    {
                        sharedMealDto.UserLike = like.Value;
                    }
                });
                sharedMealDto.TotalPoints = totalPoints;
                sharedMealDto.Foods = foodDtos;
                sharedMealDtos.Add(sharedMealDto);
            });

            return sharedMealDtos;
        }

        public async Task<ActionResult<IEnumerable<SharedMealDto>>> GetAllSharedMealsByUser(string userId)
        {
            List<SharedMeal> sharedMeals = await _context.SharedMeals.Where(sm => sm.User.UUID == userId)
                .Include(sm => sm.User)
                .AsNoTracking()
                .ToListAsync();

            var sharedMealDtos = new List<SharedMealDto>();
            sharedMeals.ForEach(sm => sharedMealDtos.Add(_mapper.Map<SharedMealDto>(sm)));

            return sharedMealDtos;
        }

        public async Task<ActionResult<SharedMealDto>> GetSingleSharedMeal(string id, string userId)
        {
            var sharedMeal = await _context.SharedMeals.Where(sm => sm.User.UUID == userId && sm.UUID == id)
                .Include(m => m.User)
                .Include(m => m.SharedMealFoods)
                    .ThenInclude(mf => mf.Food)
                        .ThenInclude(f => f.User)
                .AsNoTracking()
                .FirstOrDefaultAsync();

            if (sharedMeal == null)
            {
                return null;
            }

            var foodDtos = new List<FoodDto>();
            sharedMeal.SharedMealFoods.ToList().ForEach(e => {
                var foodDto = _mapper.Map<FoodDto>(e.Food);
                foodDto.Amount = e.FoodAmount;
                foodDto.Energy *= (foodDto.Amount / 100);
                foodDto.Protein *= (foodDto.Amount / 100);
                foodDto.Carbs *= (foodDto.Amount / 100);
                foodDto.Fat *= (foodDto.Amount / 100);
                foodDto.Sugar *= (foodDto.Amount / 100);
                foodDto.Fiber *= (foodDto.Amount / 100);
                foodDtos.Add(foodDto);
            });
            var sharedMealDto = _mapper.Map<SharedMealDto>(sharedMeal);
            sharedMealDto.Foods = foodDtos;

            return sharedMealDto;
        }

        public async Task<ResultDto> AddNewSharedMeal(SharedMealDto sharedMealDto, string userId)
        {
            var user = await _context.Users.Where(u => u.UUID == userId).FirstOrDefaultAsync();

            if (user == null)
            {
                return new ResultDto(false, "Unauthorized");
            }

            List<Food> foods = _foodService.MapFoodDtoListToFoodList(sharedMealDto.Foods);
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
                    SharedMeal = sharedMeal,
                    FoodAmount = sharedMealDto.Foods.FindLast(food => food.UUID == f.UUID).Amount
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
            sharedMeal.Shared = sharedMeal.Shared;

            List<Food> foods = _foodService.MapFoodDtoListToFoodList(sharedMealDto.Foods);
            _context.SharedMealFoods.RemoveRange(_context.SharedMealFoods.Where(smf => smf.SharedMealId == sharedMeal.Id));
            foods.ForEach(f => {
                var smf = new SharedMealFood
                {
                    Food = f,
                    SharedMeal = sharedMeal,
                    FoodAmount = sharedMealDto.Foods.FindLast(food => food.UUID == f.UUID).Amount
                };
                _context.Add(smf);
            });

            _context.Entry(sharedMeal).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Meal updated succesfully");
        }

        public ICollection<Meal> AddMeals(List<MealDto> mealDtos, string userId)
        {
            ICollection<Meal> meals = new List<Meal>();
            mealDtos.ForEach(m =>
            {
                var meal = _mapper.Map<Meal>(m);
                meal.User = _context.Users.Where(u => u.UUID == userId).FirstOrDefault();
                meals.Add(meal);
                _context.Meals.Add(meal);
                m.Foods.ForEach(f =>
                {
                    var food = _mapper.Map<Food>(f);
                    food.Id = _context.Foods.Where(fd => fd.UUID == f.UUID).FirstOrDefault().Id;
                    _context.Add(new MealFood { 
                        Food = food,
                        Meal = meal,
                        FoodAmount = f.Amount
                    });
                });
            });
            return meals;
        }

        public async Task<ResultDto> DeleteSharedMeal(string id, string userId)
        {
            var sharedMeal = await _context.SharedMeals.Where(sm => sm.UUID == id && sm.User.UUID == userId)
                .Include(sm => sm.User).FirstOrDefaultAsync();

            if (sharedMeal == null)
            {
                _logger.LogDebug("SharedMeal not found with UUID: ", id);
                return new ResultDto(false, "Not found");
            }

            _context.SharedMeals.Remove(sharedMeal);
            await _context.SaveChangesAsync();

            return new ResultDto(true, "Shared meal deleted succesfully");
        }

        public ResultDto DeleteMultipleSharedMeals(List<string> mealIds, string userId)
        {
            mealIds.ForEach(mealId => { 
                var sharedMeal = _context.SharedMeals.Where(sm => sm.UUID == mealId && sm.User.UUID == userId).FirstOrDefault();

                if (sharedMeal == null)
                {
                    _logger.LogDebug("SharedMeal not found with UUID: ", mealId);
                }

                _context.SharedMeals.Remove(sharedMeal);
                _context.SaveChanges();
            });

            return new ResultDto(true, "Meals deleted succesfully");
        }

        public async Task<List<MealNameDto>> UpdateMealNamesForUser(string userId, List<MealNameDto> mealNameDtos)
        {
            mealNameDtos.ForEach(mn =>
            {
                if (!mn.Deleted)
                {
                    if (mn.UUID != null)
                    {
                        var meal = _context.MealNames.Where(m => m.UUID == mn.UUID && m.User.UUID == userId).FirstOrDefault();
                        if (meal != null)
                        {
                            meal.Name = mn.Name;
                            meal.UpdatedAt = DateTime.Now;
                            _context.Entry(meal).State = EntityState.Modified;
                            _context.SaveChanges();
                        }
                    }
                    else
                    {
                        var user = _context.Users.Where(u => u.UUID == userId).FirstOrDefault();
                        var meal = new MealName(mn.Name, user);
                        _context.Add(meal);
                        _context.SaveChanges();
                    }
                } else
                {
                    var meal = _context.MealNames.Where(m => m.UUID == mn.UUID && m.User.UUID == userId).FirstOrDefault();
                    _context.MealNames.Remove(meal);
                    _context.SaveChanges();
                }

            });

            List<MealNameDto> dtos = new List<MealNameDto>();
            var mealNames = await _context.MealNames.Where(m => m.User.UUID == userId)
                .OrderBy(m => m.CreatedAt)
                .ToListAsync();
            mealNames.ForEach(m => dtos.Add(_mapper.Map<MealNameDto>(m)));

            return dtos;
        }

        public List<MealName> GenerateDefaultMealNamesForUser()
        {
            return new List<MealName>
            {
                new MealName("Aamupala"), new MealName("Lounas"), new MealName("Välipala 1"), new MealName("Sali"), new MealName("Välipala 2"), new MealName("Iltapala")
            };
        }

    }
}
