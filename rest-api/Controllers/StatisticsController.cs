using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Makro.Services;
using Makro.DTO;
using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;

namespace Makro.Controllers
{
    [Route("api/v2/statistics")]
    [ApiController]
    public class StatisticsController : ControllerBase
    {
        private readonly StatisticsService _statisticsService;
        public StatisticsController(StatisticsService statisticsService)
        {
            _statisticsService = statisticsService;
        }
        [HttpGet]
        public async Task<StatsDto> GetStats()
        {
            return await _statisticsService.GetStats();
        }
    }
}
