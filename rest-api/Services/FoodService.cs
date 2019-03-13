using Makro.DB;
using Makro.Models;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Makro.DTO;
using System;
using AutoMapper;
namespace Makro.Services
{
    public class FoodService
    {
        private readonly MakroContext _context;
        private readonly ILogger _logger;
        private readonly IMapper _mapper;

        public FoodService(MakroContext context, ILogger<FoodService> logger, IMapper mapper)
        {
            _logger = logger;
            _context = context;
            _mapper = mapper;
        }

        public async Task<ActionResult<IEnumerable<FoodDto>>> GetAllFoods()
        {
            var foods = await _context.Foods.Include(f => f.User).AsNoTracking().ToListAsync();
            var foodDtos = new List<FoodDto>();
            foods.ForEach(f => foodDtos.Add(_mapper.Map<FoodDto>(f)));
            return foodDtos;
        }

        public async Task<ActionResult<IEnumerable<FoodDto>>> GetAllFoodsExcludeOtherUsers(string userId)
        {
            var foods = await _context.Foods.Include(f => f.User).Where(f => f.User.UUID == userId || f.User.Username == "admin").AsNoTracking().ToListAsync();
            var foodDtos = new List<FoodDto>();
            foods.ForEach(f => foodDtos.Add(_mapper.Map<FoodDto>(f)));
            return foodDtos;
        }

        public async Task<ActionResult<IEnumerable<FoodDto>>> GetAllFoodsByUser(string id)
        {
            var foods = await _context.Foods.Include(f => f.User).Where(f => f.User.UUID == id).AsNoTracking().ToListAsync();
            var foodDtos = new List<FoodDto>();
            foods.ForEach(f => foodDtos.Add(_mapper.Map<FoodDto>(f)));
            return foodDtos;
        }

        public async Task<ResultDto> AddNewFood(FoodDto foodDto,string userId)
        {
            var food = _mapper.Map<Food>(foodDto);
            food.User = await _context.Users.Where(u => u.UUID == userId).FirstOrDefaultAsync();
            food.UUID = Guid.NewGuid().ToString();
            food.CreatedAt = DateTime.Now;
            food.UpdatedAt = DateTime.Now;
            _context.Add(food);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Food added succesfully");
        }

        public async Task<ResultDto> AddNewEditedFood(EditedFood editedFood)
        {
            editedFood.UUID = Guid.NewGuid().ToString();
            _context.Add(editedFood);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Food added succesfully");
        }

        public async Task<ResultDto> UpdateFoodInformation(FoodDto foodDto)
        {
            var food = await _context.Foods.Where(f => f.UUID == foodDto.UUID).FirstOrDefaultAsync();

            if (food == null)
            {
                _logger.LogDebug("Food not found with id: ", foodDto.UUID);
                return new ResultDto(false, "Food not found");
            }

            food.UpdatedAt = DateTime.Now;
            food.Name = foodDto.Name ?? food.Name;
            food.Energy = foodDto.Energy;
            food.Carbs = foodDto.Carbs;
            food.Fat = foodDto.Fat;
            food.Protein = foodDto.Protein;
            food.Fiber = foodDto.Fiber;
            food.Sugar = foodDto.Sugar;
            food.PackageSize = foodDto.PackageSize;
            food.ServingSize = foodDto.ServingSize;

            _context.Entry(food).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Food updated succesfully");
        }

        public async Task<ResultDto> DeleteFood(string id, string userId)
        {
            var food = await _context.Foods.Include(f => f.User).Where(f => f.UUID == id).FirstOrDefaultAsync();

            if (food == null)
            {
                _logger.LogDebug("Food not found with id: ", id);
                return new ResultDto(false, "Food not found");
            }

            if (food.User.UUID != userId)
            {
                _logger.LogError("User with id ", userId + " tried to delete food which belogs to " + food.User.UUID);
                return new ResultDto(false, "Unauthorized");
            }

            _context.Foods.Remove(food);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Food deleted succesfully");
        }

        public ResultDto DeleteMultipleFoods(List<string> foodIds, string userId)
        {
            foodIds.ForEach(foodId => { 
                var food = _context.Foods.Include(f => f.User).Where(f => f.UUID == foodId && f.User.UUID == userId).FirstOrDefault();

                if (food == null)
                {
                    _logger.LogDebug("Food not found with id: ", foodId);
                }

                _context.Foods.Remove(food);
                _context.SaveChanges();
            });

            return new ResultDto(true, "Foods deleted succesfully");
        }

        public async Task<AmountDto> GetAmountOfFoods()
        {
            return new AmountDto(await _context.Foods.CountAsync());
        }

        public List<Food> MapFoodDtoListToFoodList(List<FoodDto> foodDtos)
        {
            List<Food> foods = new List<Food>();
            foodDtos.ForEach(f => foods.Add(_mapper.Map<Food>(f)));
            foods.ForEach(f => f.Id = _context.Foods.Where(food => food.UUID == f.UUID).FirstOrDefault().Id);
            return foods;
        }
    }
}
