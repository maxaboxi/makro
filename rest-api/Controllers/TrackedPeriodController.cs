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

        [HttpPost("new")]
        public async Task<ResultDto> AddNewTrackedPeriod([FromBody]NewTrackedPeriodDto newTrackedPeriodDto)
        {
            return await _trackedPeriodService.AddNewTrackedPeriod(newTrackedPeriodDto, HttpContext.User.Identity.Name);
        }
    }
}