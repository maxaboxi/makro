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
    public class DayService
    {
        private readonly MakroContext _context;
        private readonly ILogger _logger;

        public DayService(MakroContext context, ILogger<DayService> logger)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<ActionResult<IEnumerable<Day>>> GetAllDaysByUser(User user)
        {
            return await _context.Days.Where(d => d.User.Id == user.Id || d.User.Username == user.Username).ToListAsync();
        }

        public async Task<ResultDto> AddNewDay(Day day)
        {
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
