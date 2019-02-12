using Makro.Models;
using System.Collections.Generic;
using AutoMapper;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Makro.DTO;
using System;
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

        public async Task<ActionResult<IEnumerable<SharedMeal>>> GetAllSharedMeals()
        {
            return await _context.SharedMeals.ToListAsync();
        }

        public async Task<ResultDto> AddNewSharedMeal(SharedMeal sharedMeal)
        {
            sharedMeal.UUID = Guid.NewGuid().ToString();
            _context.Add(sharedMeal);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Meal shared succesfully");
        }

        public async Task<ResultDto> UpdateSharedMeal(SharedMeal sharedMeal)
        {
            _context.Entry(sharedMeal).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Meal updated succesfully");
        }

        public async Task<ResultDto> DeleteSharedMeal(int id)
        {
            var sharedMeal = await _context.SharedMeals.FindAsync(id);

            if (sharedMeal == null)
            {
                _logger.LogDebug("SharedMeal not found with id: ", id);
                return new ResultDto(false, "Shared meal was not found");
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
    }
}
