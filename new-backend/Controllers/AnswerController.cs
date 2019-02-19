using Microsoft.AspNetCore.Mvc;
using Makro.Services;
using Microsoft.AspNetCore.Authorization;
using Makro.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Makro.DTO;
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

        [HttpGet("user/{id}")]
        public async Task<ActionResult<IEnumerable<AnswerDto>>> GetAllAnswerByUser(string id)
        {
            if (HttpContext.User.Identity.Name != id)
            {
                return Unauthorized();
            }

            return await _answerService.GetAllAnswersByUser(id);
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
    }
}
