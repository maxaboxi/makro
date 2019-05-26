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
                .Include(t => t.TrackedPeriodDays)
                    .ThenInclude(tpd => tpd.Day)
                        .ThenInclude(d => d.User)
                .Include(t => t.TrackedPeriodDays)
                    .ThenInclude(tpd => tpd.Day)
                .FirstOrDefaultAsync();

            if (tp == null)
            {
                _logger.LogDebug("No tracked period found with user: {0} and tracked period uuid: {1}", userId, uuid);
                return null;
            }

            var tpDto = _mapper.Map<TrackedPeriodDto>(tp);
            var dayDtos = new List<DayDto>();

            tp.TrackedPeriodDays.ToList().ForEach(tpd =>
            {
                var dayDto = _mapper.Map<DayDto>(tpd.Day);
                dayDtos.Add(dayDto);
            });

            tpDto.Days = dayDtos;
            return tpDto;
        }

        public async Task<ActionResult<TrackedPeriodDto>> GetLastSevenDayTotals(string userId)
        {
            var days = await _context.Days.Where(
                d => d.User.UUID == userId &&
                d.Date == null ? d.CreatedAt >= DateTime.Now.AddDays(-7)
                : d.Date >= DateTime.Now.AddDays(-7)
                )
                .Include(d => d.User)
                .Include(d => d.Meals)
                    .ThenInclude(m => m.MealFoods)
                        .ThenInclude(mf => mf.Food)
                            .ThenInclude(f => f.User)
                .ToListAsync();

            if (days != null)
            {
                var tp = new TrackedPeriod
                {
                    UUID = Guid.NewGuid().ToString(),
                    Name = "Last 7 days",
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    User = await _context.Users.Where(u => u.UUID == userId).FirstOrDefaultAsync(),
                };

                tp = CalculateTotals(tp, days);

                var tpDto = _mapper.Map<TrackedPeriodDto>(tp);
                var dayDtos = new List<DayDto>();

                days.ForEach(day =>
                {
                    var dayDto = _mapper.Map<DayDto>(day);
                    dayDtos.Add(dayDto);
                });

                tpDto.Days = dayDtos;
                return tpDto;
            }

            return new TrackedPeriodDto();
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

            var tp = new TrackedPeriod
            {
                UUID = Guid.NewGuid().ToString(),
                Name = newTrackedPeriodDto.Name,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                User = await _context.Users.Where(u => u.UUID == userId).FirstOrDefaultAsync(),
            };

            tp = CalculateTotals(tp, days);

            _context.Add(tp);

            days.ForEach(d =>
            {
                var tpd = new TrackedPeriodDay
                {
                    Day = d,
                    TrackedPeriod = tp
                };
                _context.Add(tpd);
            });

            await _context.SaveChangesAsync();

            return new ResultDto(true, "New period saved succesfully");
        }

        public async Task<ResultDto> UpdateTrackedPeriod(NewTrackedPeriodDto trackedPeriodDto, string userId)
        {
            var tp = await _context.TrackedPeriods.Where(tr => tr.UUID == trackedPeriodDto.UUID).FirstOrDefaultAsync();

            if (tp == null)
            {
                _logger.LogDebug("SharedMeal not found with UUID: ", trackedPeriodDto.UUID);
                return new ResultDto(false, "Tracked Period not found");
            }

            var days = new List<Day>();
            trackedPeriodDto.DayIds.ForEach(d => days.Add(
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

            _context.TrackedPeriodDays.RemoveRange(_context.TrackedPeriodDays.Where(tpd => tpd.TrackedPeriodId == tp.Id));
            tp = CalculateTotals(tp, days);
            tp.Name = trackedPeriodDto.Name;
            tp.UpdatedAt = DateTime.Now;

            days.ForEach(d =>
            {
                var tpd = new TrackedPeriodDay
                {
                    Day = d,
                    TrackedPeriod = tp
                };
                _context.Add(tpd);
            });

            _context.Entry(tp).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return new ResultDto(true, "Tracked period updated succesfully");
        }

        public async Task<ResultDto> DeleteTrackedPeriod(string id, string userId)
        {
            var trackedPeriod = await _context.TrackedPeriods.Where(tp => tp.UUID == id && tp.User.UUID == userId)
                .FirstOrDefaultAsync();

            if (trackedPeriod == null)
            {
                _logger.LogDebug("TrackedPeriod not found with UUID: ", id);
                return new ResultDto(false, "Not found");
            }

            _context.TrackedPeriods.Remove(trackedPeriod);
            await _context.SaveChangesAsync();

            return new ResultDto(true, "Tracked period deleted succesfully");
        }

        public ResultDto DeleteMultipleTrackedPeriod(List<string> trackedPeriodIds, string userId)
        {
            trackedPeriodIds.ForEach(id =>
            {
                var trackedPeriod = _context.TrackedPeriods.Where(tp => tp.UUID == id && tp.User.UUID == userId)
                .FirstOrDefault();

                if (trackedPeriod == null)
                {
                    _logger.LogDebug("TrackedPeriod not found with UUID: ", id);
                }

                _context.TrackedPeriods.Remove(trackedPeriod);
                _context.SaveChanges();
            });

            return new ResultDto(true, "Tracked period deleted succesfully");
        }

        private TrackedPeriod CalculateTotals(TrackedPeriod tp, List<Day> days)
        {
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

            tp.AverageCaloriesPerDay = totalCalories / days.Count;
            tp.SmallestCalorieCount = calorieCountForDays.Min();
            tp.BiggestCalorieCount = calorieCountForDays.Max();
            tp.TotalCalories = totalCalories;
            tp.TotalProtein = totalProtein;
            tp.TotalCarbs = totalCarbs;
            tp.TotalFat = totalFat;
            tp.TotalFiber = totalFiber;
            tp.TotalSugar = totalSugar;
            tp.TotalFoodWeight = totalFoodWeight;

            return tp;
        }
    }
}
