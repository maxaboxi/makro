using Microsoft.AspNetCore.Mvc;
using Makro.Services;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Threading.Tasks;
using Makro.DTO;
using System;
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

        [HttpGet("user")]
        public async Task<ActionResult<IEnumerable<AnswerDto>>> GetAllAnswerByUser()
        {
            return await _answerService.GetAllAnswersByUser(HttpContext.User.Identity.Name);
        }

        [HttpPost("new")]
        public async Task<IActionResult> AddNewAnswer([FromBody]AnswerDto answerDto)
        {
            if (answerDto.QuestionUUID == null || answerDto.AnswerBody == null)
            {
                return BadRequest();
            }

            return Ok(await _answerService.AddNewAnswer(answerDto, HttpContext.User.Identity.Name));
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateAnswer(string id, [FromBody]AnswerDto answerDto)
        {
            if (id != answerDto.UUID)
            {
                return BadRequest();
            }

            return Ok(await _answerService.UpdateAnswer(answerDto, HttpContext.User.Identity.Name));
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteAnswer(string id)
        {
            return Ok(await _answerService.DeleteAnswer(id, HttpContext.User.Identity.Name));
        }

        [HttpDelete("delete/multiple")]
        public ResultDto DeleteMultipleAnswers([FromBody]List<string> answerIds)
        {
            return _answerService.DeleteMultipleAnswers(answerIds, HttpContext.User.Identity.Name);
        }
    }
}
