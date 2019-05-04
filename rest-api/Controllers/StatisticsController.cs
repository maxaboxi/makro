using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Makro.Services;
using Makro.DTO;
using Microsoft.AspNetCore.Authorization;

namespace Makro.Controllers
{
    [Authorize]
    [Route("api/v2/statistics")]
    [ApiController]
    public class StatisticsController : ControllerBase
    {
        private readonly StatisticsService _statisticsService;
        public StatisticsController(StatisticsService statisticsService)
        {
            _statisticsService = statisticsService;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<StatsDto> GetStats()
        {
            return await _statisticsService.GetStats();
        }

        [HttpPost("pdf")]
        public async Task<ActionResult<ResultDto>> PdfCreated([FromBody]UserPdfDto userPdfDto)
        {
            if (userPdfDto.User != HttpContext.User.Identity.Name)
            {
                return BadRequest();
            }

            return await _statisticsService.PdfCreated(userPdfDto);
        } 
    }
}
