﻿using Microsoft.AspNetCore.Mvc;
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

        [HttpGet("history/{dayId}")]
        public async Task<ActionResult<List<DayDto>>> GetDayVersionHistory(string dayId)
        {
            return await _dayService.GetDayVersionHistory(dayId, HttpContext.User.Identity.Name);
        }

        [HttpGet("shared/user")]
        public async Task<ActionResult<IEnumerable<SharedDayDto>>> GetAllSharedDaysByUser()
        {
            return await _dayService.GetAllSharedDaysByUser(HttpContext.User.Identity.Name);
        }

        [HttpPost("restore/{dayId}")]
        public async Task<ActionResult<ResultDto>> RestoreDayFromVersionHistory(string dayId)
        {
            return await _dayService.RestoreDayFromVersionHistory(dayId, HttpContext.User.Identity.Name);
        }

        [HttpGet("single/{dayId}")]
        public async Task<ActionResult<DayDto>> GetSingleDay(string dayId)
        {
            return await _dayService.GetDay(dayId, HttpContext.User.Identity.Name);
        }

        [HttpPost("multiple")]
        public async Task<ActionResult<List<DayDto>>> GetMultipleDays([FromBody]string[] dayIds)
        {
            return await _dayService.GetMultipleDays(dayIds, HttpContext.User.Identity.Name);
        }

        [HttpPost("new")]
        public async Task<ActionResult<ResultDto>> AddNewDay([FromBody]DayDto dayDto)
        {
            return Ok(await _dayService.AddNewDay(dayDto, HttpContext.User.Identity.Name));
        }

        [HttpPost("share")]
        public async Task<ActionResult<ResultDto>> ShareDay([FromBody]DayDto dayDto)
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
        public async Task<ActionResult<ResultDto>> UpdateDay(string id, [FromBody]DayDto dayDto)
        {
            if (id != dayDto.UUID)
            {
                return BadRequest();
            }

            return Ok(await _dayService.UpdateDay(dayDto, HttpContext.User.Identity.Name));
        }

        [HttpPut("updatenames")]
        public ResultDto UpdateDayNames([FromBody]List<DayDto> dayDtos)
        {
            return _dayService.UpdateDayNames(dayDtos, HttpContext.User.Identity.Name);
        }

        [HttpDelete("delete/{id}")]
        public async Task<ActionResult<ResultDto>> DeleteDay(string id)
        {
            return Ok(await _dayService.DeleteDay(id, HttpContext.User.Identity.Name));
        }

        [HttpDelete("delete/all/{id}")]
        public async Task<ActionResult<ResultDto>> DeleteDayAndVersions(string id)
        {
            return Ok(await _dayService.DeleteDayAndVersions(id, HttpContext.User.Identity.Name));
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
