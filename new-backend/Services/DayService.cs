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

        public DayService(MakroContext context, ILogger<DayService> logger, IMapper mapper)
        {
            _logger = logger;
            _context = context;
            _mapper = mapper;
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
                m.MealFoods.ToList().ForEach(mf => foodDtos.Add(_mapper.Map<FoodDto>(mf.Food)));
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

        public async Task<ResultDto> UpdateDay(Day day)
        {
            _context.Entry(day).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Day updated succesfully");
        }

        public async Task<ResultDto> DeleteDay(int id)
        {
            var day = await _context.Days.FindAsync(id);

            if (day == null)
            {
                _logger.LogDebug("Day not found with id: ", id);
                return new ResultDto(false, "Day not found");
            }

            _context.Days.Remove(day);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Day deleted succesfully");
        }
    }
}
