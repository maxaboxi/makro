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
