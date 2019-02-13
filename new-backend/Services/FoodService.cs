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
        private readonly UserService _userService;
        private readonly IMapper _mapper;

        public FoodService(MakroContext context, ILogger<FoodService> logger, UserService userService, IMapper mapper)
        {
            _logger = logger;
            _context = context;
            _userService = userService;
            _mapper = mapper;
        }

        public async Task<ActionResult<IEnumerable<FoodDto>>> GetAllFoods()
        {
            var foods = await _context.Foods.ToListAsync();
            var foodDtos = new List<FoodDto>();
            foods.ForEach(f => foodDtos.Add(_mapper.Map<FoodDto>(f)));
            return foodDtos;
        }

        public async Task<ActionResult<IEnumerable<FoodDto>>> GetAllFoodsByUser(string id)
        {
            var foods = await _context.Foods.Where(f => f.User.UUID == id).ToListAsync();
            var foodDtos = new List<FoodDto>();
            foods.ForEach(f => foodDtos.Add(_mapper.Map<FoodDto>(f)));
            return foodDtos;
        }

        public async Task<ResultDto> AddNewFood(Food food, string userId)
        {
            var user = _userService.GetUser(userId);
            if (user == null)
            {
                return new ResultDto(false, "Unauthorized");
            }
            food.User = user;
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

        public async Task<ResultDto> UpdateFoodInformation(Food food)
        {
            food.UpdatedAt = DateTime.Now;
            _context.Entry(food).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Food updated succesfully");
        }

        public async Task<ResultDto> DeleteFood(int id)
        {
            var food = await _context.Foods.FindAsync(id);

            if (food == null)
            {
                _logger.LogDebug("Food not found with id: ", id);
                return new ResultDto(false, "Food not found");
            }

            _context.Foods.Remove(food);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Food deleted succesfully");
        }

        public async Task<AmountDto> GetAmountOfFoods()
        {
            return new AmountDto(await _context.Foods.CountAsync());
        }
    }
}
