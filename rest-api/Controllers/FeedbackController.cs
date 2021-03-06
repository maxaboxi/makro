﻿using Microsoft.AspNetCore.Mvc;
using Makro.Services;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using System.Collections.Generic;
using Makro.DTO;
namespace Makro.Controllers
{
    [Authorize]
    [Route("api/v2/feedback")]
    public class FeedbackController : ControllerBase
    {
        private readonly FeedbackService _feedbackService;
        public FeedbackController(FeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FeedbackDto>>> GetAllFeedbacks()
        {
            return await _feedbackService.GetAllFeedbacks();
        }

        [HttpGet("user")]
        public async Task<ActionResult<IEnumerable<FeedbackDto>>> GetAllFeedbacksByUser()
        {
            return await _feedbackService.GetAllFeedbacksByUser(HttpContext.User.Identity.Name);
        }

        [HttpPost("new")]
        public async Task<IActionResult> AddNewFeedback([FromBody]FeedbackDto feedbackDto)
        {
            if ( feedbackDto.FeedbackBody == null)
            {
                return BadRequest();
            }

            return Ok(await _feedbackService.AddNewFeedback(feedbackDto, HttpContext.User.Identity.Name));
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateFeedback(string id, [FromBody]FeedbackDto feedbackDto)
        {
            if (id != feedbackDto.UUID)
            {
                return BadRequest();
            }

            return Ok(await _feedbackService.UpdateFeedback(feedbackDto, HttpContext.User.Identity.Name));
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteFeedback(string id)
        {
            return Ok(await _feedbackService.DeleteFeedback(id, HttpContext.User.Identity.Name));
        }
    }
}
