using Microsoft.AspNetCore.Mvc;
using Makro.Services;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Threading.Tasks;
using Makro.DTO;
namespace Makro.Controllers
{
    [Authorize]
    [Route("api/v2/question")]
    public class QuestionController : ControllerBase
    {
        private readonly QuestionService _questionService;
        public QuestionController(QuestionService questionService)
        {
            _questionService = questionService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<QuestionDto>>> GetAllQuestions()
        {
            return await _questionService.GetAllQuestions();
        }

        [HttpGet("user/{id}")]
        public async Task<ActionResult<IEnumerable<QuestionDto>>> GetAllQuestionsByUser(string id)
        {
            if (HttpContext.User.Identity.Name != id)
            {
                return Unauthorized();
            }

            return await _questionService.GetAllQuestionsByUser(id);
        }

        [HttpPost("new")]
        public async Task<IActionResult> AddNewQuestion([FromBody]QuestionDto questionDto)
        {
            if (questionDto.QuestionBody == null || questionDto.Tags == null)
            {
                return BadRequest();
            }

            return Ok(await _questionService.AddNewQuestion(questionDto, HttpContext.User.Identity.Name));
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateQuestion(string id, [FromBody]QuestionDto questionDto)
        {
            if (id != questionDto.UUID)
            {
                return BadRequest();
            }

            return Ok(await _questionService.UpdateQuestion(questionDto, HttpContext.User.Identity.Name));
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteQuestion(string id)
        {
            return Ok(await _questionService.DeleteQuestion(id, HttpContext.User.Identity.Name));
        }
    }
}
