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
using Makro.Dto;
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
                sm.SharedMealFoods.ToList().ForEach(e => {
                    var foodDto = _mapper.Map<FoodDto>(e.Food);
                    foodDto.Amount = e.FoodAmount;
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
                foodDtos.Add(foodDto);
            });
            var sharedMealDto = _mapper.Map<SharedMealDto>(sharedMeal);
            sharedMealDto.Foods = foodDtos;

            return sharedMealDto;
        }

        public async Task<ResultDto> AddNewSharedMeal(SharedMealDto sharedMealDto, User user)
        {
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
            var sharedMeal = await _context.SharedMeals.Where(sm => sm.UUID == id).Include(sm => sm.User).FirstOrDefaultAsync();


            if (sharedMeal == null)
            {
                _logger.LogDebug("SharedMeal not found with UUID: ", id);
                return new ResultDto(false, "Not found");
            }

            if (sharedMeal.User.UUID != userId)
            {
                _logger.LogError("User with UUID ", userId + " tried to delete shared meal which belongs to " + sharedMeal.User.UUID);
                return new ResultDto(false, "Unauthorized");
            }

            _context.SharedMeals.Remove(sharedMeal);
            await _context.SaveChangesAsync();

            return new ResultDto(true, "Shared meal deleted succesfully");
        }

        public async Task<ResultDto> UpdateMealNamesForUser(User user, List<MealNameDto> mealNameDtos)
        {
            var originalMealNames = await _context.MealNames.Where(mn => mn.User == user).ToListAsync();
            originalMealNames.ForEach(m =>
            {
                mealNameDtos.ForEach(mnd => {
                    if (m.UUID == mnd.UUID)
                    {
                        m.Name = mnd.Name;
                        _context.Entry(m).State = EntityState.Modified;
                    }
                });
            });
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Names updated succesfully");
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
