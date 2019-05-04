using Makro.DB;
using Makro.DTO;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace Makro.Services
{
    public class StatisticsService
    {
        private readonly MakroContext _context;
        public StatisticsService(MakroContext context)
        {
            _context = context;
        }

        public async Task<StatsDto> GetStats()
        {
            return new StatsDto
            {
                Users = await _context.Users.CountAsync(),
                Foods = await _context.Foods.CountAsync(),
                Days = await _context.Days.CountAsync(),
                MaleCount = await _context.Users.Where(u => u.Sex == "mies").CountAsync(),
                FemaleCount = await _context.Users.Where(u => u.Sex == "nainen").CountAsync(),
                AverageAge = await _context.Users.Where(u => u.Age > 0).Select(u => u.Age).AverageAsync(),
                AverageHeight = await _context.Users.Where(u => u.Height > 0).Select(u => u.Height).AverageAsync(),
                AverageWeight = await _context.Users.Where(u => u.Weight > 0).Select(u => u.Weight).AverageAsync()
            };
        }
    }
}
