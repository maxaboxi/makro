﻿using Microsoft.AspNetCore.Mvc;
using Makro.Services;
using Microsoft.AspNetCore.Authorization;
using Makro.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
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
        public async Task<ActionResult<IEnumerable<Question>>> GetAllQuestions()
        {
            return await _questionService.GetAllQuestions();
        }

        [HttpGet("user/{id}")]
        public async Task<ActionResult<IEnumerable<Question>>> GetAllQuestionsByUser(string id)
        {
            return await _questionService.GetAllQuestionsByUser(id);
        }

        [HttpPost("addquestion")]
        public async Task<IActionResult> AddNewQuestion(Question question)
        {
            return Ok(await _questionService.AddNewQuestion(question));
        }

        [HttpPut("updatequestion/{id}")]
        public async Task<IActionResult> UpdateQuestion(int id, Question question)
        {
            if (id != question.Id)
            {
                return BadRequest();
            }

            return Ok(await _questionService.UpdateQuestion(question));
        }

        [HttpDelete("deletequestion/{id}")]
        public async Task<IActionResult> DeleteAnswer(int id)
        {
            return Ok(await _questionService.DeleteQuestion(id));
        }
    }
}
