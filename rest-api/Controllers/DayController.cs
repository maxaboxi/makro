using Microsoft.AspNetCore.Mvc;
using Makro.Services;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using System.Collections.Generic;
using Makro.DTO;
using System;
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

        [AllowAnonymous]
        [HttpGet("amount")]
        public async Task<AmountDto> GetAmountOfSavedDays()
        {
            return await _dayService.GetAmountOfSavedDays();
        }

        [HttpGet("user")]
        public async Task<ActionResult<IEnumerable<DayDto>>> GetAllDaysByUser()
        {
            return await _dayService.GetAllDaysByUser(HttpContext.User.Identity.Name);
        }

        [HttpGet("shared/user")]
        public async Task<ActionResult<IEnumerable<SharedDayDto>>> GetAllSharedDaysByUser()
        {
            return await _dayService.GetAllSharedDaysByUser(HttpContext.User.Identity.Name);
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

        [HttpPost("share")]
        public async Task<IActionResult> ShareDay([FromBody]DayDto dayDto)
        {
            return Ok(await _dayService.ShareDay(dayDto, HttpContext.User.Identity.Name));
        }

        [AllowAnonymous]
        [HttpGet("shared/{dayId}")]
        public async Task<ActionResult<IEnumerable<MealDto>>> GetSharedDay(string dayId)
        {
            return await _dayService.GetSharedDay(dayId);
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

        [HttpPut("updatenames")]
        public ResultDto UpdateDayNames(string id, [FromBody]List<DayDto> dayDtos)
        {
            return _dayService.UpdateDayNames(dayDtos, HttpContext.User.Identity.Name);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteDay(string id)
        {
            return Ok(await _dayService.DeleteDay(id, HttpContext.User.Identity.Name));
        }

        [HttpDelete("delete/multiple")]
        public ResultDto DeleteMultipleDays([FromBody]List<string> dayIds)
        {
            return _dayService.DeleteMultipleDays(dayIds, HttpContext.User.Identity.Name);
        }

        [HttpDelete("shared/delete/multiple")]
        public ResultDto DeleteMultipleSharedDays([FromBody]List<string> dayIds)
        {
            return _dayService.DeleteMultipleSharedDays(dayIds, HttpContext.User.Identity.Name);
        }
    }
}
