using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Makro.Services;
using Makro.DTO;

namespace Makro.Controllers
{
    [Authorize]
    [Route("api/v2/[controller]")]
    [ApiController]
    public class TrackedPeriodController : ControllerBase
    {
        private readonly TrackedPeriodService _trackedPeriodService;
        public TrackedPeriodController(TrackedPeriodService trackedPeriodService)
        {
            _trackedPeriodService = trackedPeriodService;
        }

        [HttpGet("user")]
        public async Task<ActionResult<IEnumerable<TrackedPeriodDto>>> GetAllTrackedPeriodsByUser()
        {
            return await _trackedPeriodService.GetAllTrackedPeriodsByUser(HttpContext.User.Identity.Name);
        }

        [HttpGet("single/{periodId}")]
        public async Task<ActionResult<TrackedPeriodDto>> GetSingleTrackedPeriod(string periodId)
        {
            return await _trackedPeriodService.GetTrackedPeriodByUUID(periodId, HttpContext.User.Identity.Name);
        }

        [HttpGet("single/7/{includeCreatedAt}")]
        public async Task<ActionResult<TrackedPeriodDto>> GetLastSevenDays(bool includeCreatedAt)
        {
            return await _trackedPeriodService.GetLastSevenDayTotals(HttpContext.User.Identity.Name, includeCreatedAt);
        }

        [HttpPost("new")]
        public async Task<ResultDto> AddNewTrackedPeriod([FromBody]NewTrackedPeriodDto newTrackedPeriodDto)
        {
            return await _trackedPeriodService.AddNewTrackedPeriod(newTrackedPeriodDto, HttpContext.User.Identity.Name);
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateTrackedPeriod(string id, [FromBody]NewTrackedPeriodDto newTrackedPeriodDto)
        {
            if (id != newTrackedPeriodDto.UUID)
            {
                return BadRequest();
            }

            return Ok(await _trackedPeriodService.UpdateTrackedPeriod(newTrackedPeriodDto, HttpContext.User.Identity.Name));
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteTrackedPeriod(string id)
        {
            return Ok(await _trackedPeriodService.DeleteTrackedPeriod(id, HttpContext.User.Identity.Name));
        }

        [HttpDelete("delete/multiple")]
        public ResultDto DeleteMultipleTrackedPeriods([FromBody]List<string> tpIds)
        {
            return _trackedPeriodService.DeleteMultipleTrackedPeriod(tpIds, HttpContext.User.Identity.Name);
        }
    }
}