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

        public async Task<ActionResult<IEnumerable<SharedDayDto>>> GetAllSharedDaysByUser(string id)
        {
            var days = await _context.SharedDays.AsNoTracking().Where(d => d.User.UUID == id).Include(d => d.User).ToListAsync();
            var dayDtos = new List<SharedDayDto>();
            days.ForEach(d => dayDtos.Add(_mapper.Map<SharedDayDto>(d)));
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

        public async Task<ActionResult<IEnumerable<MealDto>>> GetSharedDay(string dayId)
        {
            var day = await _context.SharedDays.AsNoTracking()
                .Where(d => d.UUID == dayId)
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

            return mealDtos;
        }

        public async Task<ResultDto> AddNewDay(DayDto dayDto, string userId)
        {
            var day = _mapper.Map<Day>(dayDto);
            day.User = await _context.Users.Where(u => u.UUID == userId).FirstOrDefaultAsync();
            day.Meals = _mealService.AddMeals(dayDto.AllMeals, userId);
            day.UUID = Guid.NewGuid().ToString();
            day.CreatedAt = DateTime.Now;
            day.UpdatedAt = DateTime.Now;

            _context.Add(day);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Day added succesfully");
        }

        public async Task<ResultDto> ShareDay(DayDto dayDto, string userId)
        {
            var sharedDay = _mapper.Map<SharedDay>(dayDto);
            sharedDay.User = await _context.Users.Where(u => u.UUID == userId).FirstOrDefaultAsync();
            sharedDay.Meals = _mealService.AddMeals(dayDto.AllMeals, userId);
            sharedDay.UUID = Guid.NewGuid().ToString();
            sharedDay.CreatedAt = DateTime.Now;
            sharedDay.UpdatedAt = DateTime.Now;

            _context.Add(sharedDay);
            await _context.SaveChangesAsync();
            return new ResultDto(true, sharedDay.UUID);
        }

        public async Task<ResultDto> UpdateDay(DayDto dayDto, string userId)
        {
            var day = await _context.Days.Where(d => d.UUID == dayDto.UUID && d.User.UUID == userId)
                .Include(d => d.User)
                .Include(d => d.Meals)
                .FirstOrDefaultAsync();

            if (day == null)
            {
                _logger.LogDebug("Day not found with UUID: ", dayDto.UUID);
                return new ResultDto(false, "Day not found");
            }

            day.Meals.ToList().ForEach(m => _context.Meals.Remove(m));
            day.Meals = _mealService.AddMeals(dayDto.AllMeals, userId);
            day.UpdatedAt = DateTime.Now;

            _context.Entry(day).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return new ResultDto(true, "Day updated succesfully");
        }

        public async Task<ResultDto> DeleteDay(string id, string userId)
        {
            var day = await _context.Days.Where(d => d.UUID == id && d.User.UUID == userId).Include(d => d.Meals).FirstOrDefaultAsync();

            if (day == null)
            {
                _logger.LogDebug("Day not found with UUID: ", id);
                return new ResultDto(false, "Day not found");
            }

            day.Meals.ToList().ForEach(m => _context.Meals.Remove(m));
            _context.Days.Remove(day);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Day deleted succesfully");
        }

        public ResultDto DeleteMultipleDays(List<string> dayIds, string userId)
        {
            dayIds.ForEach(dayId => { 
                var day = _context.Days.Where(d => d.UUID == dayId && d.User.UUID == userId).Include(d => d.Meals).FirstOrDefault();

                if (day == null)
                {
                    _logger.LogDebug("Day not found with UUID: ", dayId);
                }

                day.Meals.ToList().ForEach(m => _context.Meals.Remove(m));
                _context.Days.Remove(day);
                _context.SaveChanges();
            });

            return new ResultDto(true, "Days deleted succesfully");
        }
    }
}
