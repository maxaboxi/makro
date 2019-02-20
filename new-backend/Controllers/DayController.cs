using Microsoft.AspNetCore.Mvc;
using Makro.Services;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using System.Collections.Generic;
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

        [HttpGet("user")]
        public async Task<ActionResult<IEnumerable<DayDto>>> GetAllDaysByUser()
        {
            return await _dayService.GetAllDaysByUser(HttpContext.User.Identity.Name);
        }

        [HttpGet("single/{dayId}")]
        public async Task<ActionResult<DayDto>> GetSingleDay(string dayId)
        {
            return await _dayService.GetDay(dayId, HttpContext.User.Identity.Name);
        }

        [HttpPost("new")]
        public async Task<IActionResult> AddNewDay([FromBody]DayDto dayDto)
        {
            return Ok(await _dayService.AddNewDay(dayDto, HttpContext.User.Identity.Name));
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateDay(string id, [FromBody]DayDto dayDto)
        {
            if (id != dayDto.UUID)
            {
                return BadRequest();
            }

            return Ok(await _dayService.UpdateDay(dayDto, HttpContext.User.Identity.Name));
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteDay(string id)
        {
            return Ok(await _dayService.DeleteDay(id, HttpContext.User.Identity.Name));
        }
    }
}
