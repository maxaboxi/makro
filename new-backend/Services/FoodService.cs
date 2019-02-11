using Makro.Models;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Makro.DTO;
namespace Makro.Services
{
    public class FoodService
    {
        private readonly MakroContext _context;
        private readonly ILogger _logger;

        public FoodService(MakroContext context, ILogger<FoodService> logger)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<ActionResult<IEnumerable<Food>>> GetAllFoods()
        {
            return await _context.Foods.ToListAsync();
        }

        public async Task<ActionResult<IEnumerable<Food>>> GetAllFoodsByUser(string id)
        {
            return await _context.Foods.Where(f => f.User.ObjectId == id).ToListAsync();
        }

        public async Task<ResultDto> AddNewFood(Food food)
        {
            _context.Add(food);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Food added succesfully");
        }

        public async Task<ResultDto> AddNewEditedFood(EditedFood editedFood)
        {
            _context.Add(editedFood);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Food added succesfully");
        }

        public async Task<ResultDto> UpdateFoodInformation(Food food)
        {
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

        public async Task<AmountDto> GetAmountOfUsers()
        {
            return new AmountDto(await _context.Foods.CountAsync());
        }
    }
}
