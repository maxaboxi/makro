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
    public class DayService
    {
        private readonly MakroContext _context;
        private readonly ILogger _logger;
        private readonly IMapper _mapper;
        private readonly MealService _mealService;

        public DayService(MakroContext context, ILogger<DayService> logger, IMapper mapper, MealService mealService)
        {
            _logger = logger;
            _context = context;
            _mapper = mapper;
            _mealService = mealService;
        }

        public async Task<ActionResult<IEnumerable<DayDto>>> GetAllDaysByUser(string id)
        {
            var days = await _context.Days.AsNoTracking().Where(d => d.User.UUID == id).Include(d => d.User).ToListAsync();
            var dayDtos = new List<DayDto>();
            days.ForEach(d => dayDtos.Add(_mapper.Map<DayDto>(d)));
            return dayDtos;
        }

        public async Task<ActionResult<DayDto>> GetDay(string dayId, string userId)
        {
            var day = await _context.Days.AsNoTracking()
                .Where(d => d.User.UUID == userId && d.UUID == dayId)
                .Include(d => d.User)
                .Include(d => d.Meals)
                    .ThenInclude(m => m.MealFoods)
                        .ThenInclude(mf => mf.Food)
                            .ThenInclude(f => f.User)
                .FirstOrDefaultAsync();

            if (day == null)
            {
                return null;
            }

            var dayDto = _mapper.Map<DayDto>(day);

            var mealDtos = new List<MealDto>();

            day.Meals.ToList().ForEach(m => {
                m.User = day.User;
                var mealDto = _mapper.Map<MealDto>(m);
                var foodDtos = new List<FoodDto>();
                m.MealFoods.ToList().ForEach(mf => {
                    var foodDto = _mapper.Map<FoodDto>(mf.Food);
                    foodDto.Amount = mf.FoodAmount;
                    foodDtos.Add(foodDto);
                  });
                mealDto.Foods = foodDtos;
                mealDtos.Add(mealDto);
            });

            dayDto.AllMeals = mealDtos;
            return dayDto;
        }

        public async Task<ResultDto> AddNewDay(Day day)
        {
            day.UUID = Guid.NewGuid().ToString();
            _context.Add(day);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Day added succesfully");
        }

        public async Task<ResultDto> UpdateDay(DayDto dayDto, string userId)
        {
            var day = await _context.Days.Where(d => d.UUID == dayDto.UUID)
                .Include(d => d.User)
                .Include(d => d.Meals)
                .FirstOrDefaultAsync();

            if (day == null)
            {
                _logger.LogDebug("Day not found with UUID: ", dayDto.UUID);
                return new ResultDto(false, "Day not found");
            }

            if (day.User.UUID != userId)
            {
                _logger.LogError("User with UUID ", userId + " tried to modify day which belongs to " + day.User.UUID);
                return new ResultDto(false, "Unauthorized");
            }

            day.Meals.ToList().ForEach(m => _context.Meals.Remove(m));
            day.Meals = _mealService.UpdateMeals(dayDto.AllMeals);
            day.UpdatedAt = DateTime.Now;

            _context.Entry(day).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return new ResultDto(true, "Day updated succesfully");
        }

        public async Task<ResultDto> DeleteDay(string id, string userId)
        {
            var day = await _context.Days.Where(d => d.UUID == id).Include(d => d.User).FirstOrDefaultAsync();

            if (day == null)
            {
                _logger.LogDebug("Day not found with UUID: ", id);
                return new ResultDto(false, "Day not found");
            }

            if (day.User.UUID != userId)
            {
                _logger.LogError("User with UUID ", userId + " tried to delete day which belnogs to " + day.User.UUID);
                return new ResultDto(false, "Unauthorized");
            }

            _context.Days.Remove(day);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Day deleted succesfully");
        }
    }
}
