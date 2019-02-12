using Microsoft.AspNetCore.Mvc;
using Makro.Services;
using Microsoft.AspNetCore.Authorization;
using Makro.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace Makro.Controllers
{
    [Authorize]
    [Route("api/v2/answer")]
    public class AnswerController : ControllerBase
    {
        private readonly AnswerService _answerService;
        public AnswerController(AnswerService answerService)
        {
            _answerService = answerService;
        }

        [HttpGet("question/{id}")]
        public async Task<ActionResult<IEnumerable<Answer>>> GetAllAnswersForQuestion(int id)
        {
            return await _answerService.GetAllAnswersForQuestion(id);
        }

        [HttpGet("user/{id}")]
        public async Task<ActionResult<IEnumerable<Answer>>> GetAllAnswerByUser(string id)
        {
            return await _answerService.GetAllAnswersByUser(id);
        }

        [HttpPost("addanswer")]
        public async Task<IActionResult> AddNewAnswer(Answer answer)
        {
            return Ok(await _answerService.AddNewAnswer(answer));
        }

        [HttpPut("updateanswer/{id}")]
        public async Task<IActionResult> UpdateAnswer(int id, Answer answer)
        {
            if (id != answer.Id)
            {
                return BadRequest();
            }

            return Ok(await _answerService.UpdateAnswer(answer));
        }

        [HttpDelete("deletanswer/{id}")]
        public async Task<IActionResult> DeleteAnswer(int id)
        {
            return Ok(await _answerService.DeleteAnswer(id));
        }
    }
}
