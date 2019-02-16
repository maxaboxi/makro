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
            var foods = await _context.Foods.Include(f => f.User).AsNoTracking().ToListAsync();
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
            food.Id = _context.Foods.Where(f => f.UUID == food.UUID).AsNoTracking().FirstOrDefault().Id;
            food.UpdatedAt = DateTime.Now;
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

        public async Task<AmountDto> GetAmountOfFoods()
        {
            return new AmountDto(await _context.Foods.CountAsync());
        }
    }
}
