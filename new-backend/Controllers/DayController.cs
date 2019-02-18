using Microsoft.AspNetCore.Mvc;
using Makro.Services;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using System.Collections.Generic;
using Makro.Models;
using Makro.DTO;
namespace Makro.Controllers
{
    [Authorize]
    [Route("api/v2/day")]
    public class DayController : ControllerBase
    {
        private readonly DayService _dayService;
        public DayController(DayService dayService)
        {
            _dayService = dayService;
        }

        [HttpGet("all/{id}")]
        public async Task<ActionResult<IEnumerable<DayDto>>> GetAllDaysByUser(string id)
        {
            if (HttpContext.User.Identity.Name != id)
            {
                return Unauthorized();
            }

            return await _dayService.GetAllDaysByUser(id);
        }

        [HttpGet("single/{dayId}")]
        public async Task<ActionResult<DayDto>> GetSingleDay(string dayId)
        {
            return await _dayService.GetDay(dayId, HttpContext.User.Identity.Name);
        }

        [HttpPost("addday")]
        public async Task<IActionResult> AddNewDay(Day day)
        {
            return Ok(await _dayService.AddNewDay(day));
        }

        [HttpPut("updateday/{id}")]
        public async Task<IActionResult> UpdateDay(string id, [FromBody]DayDto dayDto)
        {
            if (id != dayDto.UUID)
            {
                return BadRequest();
            }

            return Ok(await _dayService.UpdateDay(dayDto, HttpContext.User.Identity.Name));
        }

        [HttpDelete("deleteday/{id}")]
        public async Task<IActionResult> DeleteDay(string id)
        {
            return Ok(await _dayService.DeleteDay(id, HttpContext.User.Identity.Name));
        }
    }
}
