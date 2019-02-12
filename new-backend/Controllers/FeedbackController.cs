using Microsoft.AspNetCore.Mvc;
using Makro.Services;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using System.Collections.Generic;
using Makro.Models;
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
        public async Task<ActionResult<IEnumerable<Feedback>>> GetAllFeedbacks()
        {
            return await _feedbackService.GetAllFeedbacks();
        }

        [HttpPost("addfeedback")]
        public async Task<IActionResult> AddNewFeedback(Feedback feedback)
        {
            return Ok(await _feedbackService.AddNewFeedback(feedback));
        }

        [HttpPut("updatefeedback/{id}")]
        public async Task<IActionResult> UpdateFeedbackl(int id, Feedback feedback)
        {
            if (id != feedback.Id)
            {
                return BadRequest();
            }

            return Ok(await _feedbackService.UpdateFeedback(feedback));
        }

        [HttpDelete("deletefeedbackl/{id}")]
        public async Task<IActionResult> DeleteFeedback(int id)
        {
            return Ok(await _feedbackService.DeleteFeedback(id));
        }
    }
}
