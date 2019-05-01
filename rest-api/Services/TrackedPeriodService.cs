using AutoMapper;
using Makro.DB;
using Makro.DTO;
using Makro.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Makro.Services
{
    public class TrackedPeriodService
    {
        private readonly MakroContext _context;
        private readonly ILogger _logger;
        private readonly IMapper _mapper;

        public TrackedPeriodService(MakroContext context, ILogger<TrackedPeriodService> logger, IMapper mapper)
        {
            _context = context;
            _logger = logger;
            _mapper = mapper;
        }

        public async Task<ActionResult<IEnumerable<TrackedPeriodDto>>> GetAllTrackedPeriodsByUser(string userId)
        {
            var trackedPeriods = await _context.TrackedPeriods
                .Where(tp => tp.User.UUID == userId).Include(tp => tp.User).AsNoTracking().ToListAsync();
            var tpDtos = new List<TrackedPeriodDto>();

            if (trackedPeriods.Count > 0)
            {
                trackedPeriods.ForEach(tp => tpDtos.Add(_mapper.Map<TrackedPeriodDto>(tp)));
            }

            return tpDtos;
        }

        public async Task<ActionResult<TrackedPeriodDto>> GetTrackedPeriodByUUID(string uuid, string userId)
        {
            var tp = await _context.TrackedPeriods.Where(t => t.UUID == uuid && t.User.UUID == userId)
                .AsNoTracking()
                .Include(t => t.User)
                .Include(t => t.Days)
                    .ThenInclude(d => d.User)
                .Include(t => t.Days)
                    .ThenInclude(d => d.Meals)
                        .ThenInclude(m => m.MealFoods)
                            .ThenInclude(mf => mf.Food)
                                .ThenInclude(f => f.User)
                .FirstOrDefaultAsync();

            if (tp == null)
            {
                _logger.LogDebug("No tracked period found with user: {0} and tracked period uuid: {1}", userId, uuid);
                return null;
            }

            var tpDto = _mapper.Map<TrackedPeriodDto>(tp);
            var dayDtos = new List<DayDto>();
            var mealDtos = new List<MealDto>();

            tp.Days.ToList().ForEach(day =>
            {
                var dayDto = _mapper.Map<DayDto>(day);
                day.Meals.ToList().ForEach(m =>
                {
                    m.User = day.User;
                    var mealDto = _mapper.Map<MealDto>(m);
                    var foodDtos = new List<FoodDto>();
                    m.MealFoods.ToList().ForEach(mf =>
                    {
                        var foodDto = _mapper.Map<FoodDto>(mf.Food);
                        foodDto.Amount = mf.FoodAmount;
                        foodDto.Energy = foodDto.Energy * (foodDto.Amount / 100);
                        foodDto.Protein = foodDto.Protein * (foodDto.Amount / 100);
                        foodDto.Carbs = foodDto.Carbs * (foodDto.Amount / 100);
                        foodDto.Fat = foodDto.Fat * (foodDto.Amount / 100);
                        foodDto.Sugar = foodDto.Sugar * (foodDto.Amount / 100);
                        foodDto.Fiber = foodDto.Fiber * (foodDto.Amount / 100);
                        foodDtos.Add(foodDto);
                    });
                    mealDto.Foods = foodDtos;
                    mealDtos.Add(mealDto);
                });
                dayDto.AllMeals = mealDtos;
                dayDtos.Add(dayDto);
            });

            tpDto.Days = dayDtos;
            return tpDto;
        }

        public async Task<ResultDto> AddNewTrackedPeriod(NewTrackedPeriodDto newTrackedPeriodDto, string userId)
        {
            var days = new List<Day>();
            newTrackedPeriodDto.DayIds.ForEach(d => days.Add(
                _context.Days.Where(day => day.UUID == d && day.User.UUID == userId)
                .Include(day => day.Meals)
                    .ThenInclude(m => m.MealFoods)
                        .ThenInclude(mf => mf.Food)
                .FirstOrDefault()
                )
            );

            if (days == null || days.Count == 0)
            {
                return new ResultDto(false, "No days found with given information");
            }

            decimal totalCalories = 0;
            decimal totalProtein = 0;
            decimal totalCarbs = 0;
            decimal totalFat = 0;
            decimal totalFiber = 0;
            decimal totalSugar = 0;
            decimal totalFoodWeight = 0;

            List<decimal> calorieCountForDays = new List<decimal>();

            days.ForEach(d =>
            {
                decimal totalCaloriesForDay = 0;
                d.Meals.ToList().ForEach(m =>
                {
                    m.MealFoods.ToList().ForEach(mf =>
                    {
                        totalCaloriesForDay += mf.Food.Energy * (mf.FoodAmount / 100);
                        totalFoodWeight += mf.FoodAmount;
                        totalCalories += mf.Food.Energy * (mf.FoodAmount / 100);
                        totalProtein += mf.Food.Protein * (mf.FoodAmount / 100);
                        totalCarbs += mf.Food.Carbs * (mf.FoodAmount / 100);
                        totalFat += mf.Food.Fat * (mf.FoodAmount / 100);
                        totalFiber += mf.Food.Fiber * (mf.FoodAmount / 100);
                        totalSugar += mf.Food.Sugar * (mf.FoodAmount / 100);
                    });
                });
                calorieCountForDays.Add(totalCaloriesForDay);
            });

            decimal averageCaloriesPerDay = totalCalories / days.Count;
            decimal smallestCalorieCount = calorieCountForDays.Min();
            decimal biggestCalorieCount = calorieCountForDays.Max();

            var tp = new TrackedPeriod
            {
                UUID = Guid.NewGuid().ToString(),
                Name = newTrackedPeriodDto.Name,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                User = await _context.Users.Where(u => u.UUID == userId).FirstOrDefaultAsync(),
                Days = days,
                TotalCalories = totalCalories,
                AverageCaloriesPerDay = averageCaloriesPerDay,
                TotalProtein = totalProtein,
                TotalCarbs = totalCarbs,
                TotalFat = totalFat,
                TotalFiber = totalFiber,
                TotalSugar = totalSugar,
                TotalFoodWeight = totalFoodWeight,
                SmallestCalorieCount = smallestCalorieCount,
                BiggestCalorieCount = biggestCalorieCount
            };

            _context.Add(tp);
            await _context.SaveChangesAsync();

            return new ResultDto(true, "New period saved succesfully");
        }
    }
}
