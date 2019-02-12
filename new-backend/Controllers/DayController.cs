using Microsoft.AspNetCore.Mvc;
using Makro.Services;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using System.Collections.Generic;
using Makro.Models;
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

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<Day>>> GetAllDaysByUser(string id)
        {
            return await _dayService.GetAllDaysByUser(id);
        }

        [HttpPost("addday")]
        public async Task<IActionResult> AddNewDay(Day day)
        {
            return Ok(await _dayService.AddNewDay(day));
        }

        [HttpPut("updateday/{id}")]
        public async Task<IActionResult> UpdateSharedMeal(int id, Day day)
        {
            if (id != day.Id)
            {
                return BadRequest();
            }

            return Ok(await _dayService.UpdateDay(day));
        }

        [HttpDelete("deleteday/{id}")]
        public async Task<IActionResult> DeleteFood(int id)
        {
            return Ok(await _dayService.DeleteDay(id));
        }
    }
}
