using Microsoft.AspNetCore.Mvc;
using Makro.Services;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Threading.Tasks;
using Makro.DTO;
namespace Makro.Controllers
{
    [Authorize]
    [Route("api/v2/comment")]
    public class CommentController : ControllerBase
    {
        private readonly CommentService _commentService;
        public CommentController(CommentService commentService)
        {
            _commentService = commentService;
        }

        [HttpGet("answer/{id}")]
        public async Task<ActionResult<IEnumerable<CommentDto>>> GetAllCommentsForAnswer(string id)
        {
            return await _commentService.GetAllCommentsForAnswer(id);
        }

        [HttpGet("article/{id}")]
        public async Task<ActionResult<IEnumerable<CommentDto>>> GetAllCommentsForArticle(string id)
        {
            return await _commentService.GetAllCommentsForArticle(id);
        }

        [HttpGet("user")]
        public async Task<ActionResult<IEnumerable<CommentDto>>> GetAllCommentsByUser()
        {
            return await _commentService.GetAllCommentsByUser(HttpContext.User.Identity.Name);
        }


        [HttpPost("new")]
        public async Task<IActionResult> AddNewComment([FromBody]CommentDto commentDto)
        {
            if (commentDto.AnswerUUID == null && commentDto.ArticleUUID == null && commentDto.ReplyToUUID == null)
            {
                return BadRequest();
            }

            if (commentDto.AnswerUUID != null && commentDto.ArticleUUID != null)
            {
                return BadRequest();
            }

            if (commentDto.Body == null)
            {
                return BadRequest();
            }

            return Ok(await _commentService.AddNewComment(commentDto, HttpContext.User.Identity.Name));
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateComment(string id, [FromBody]CommentDto commentDto)
        {
            if (id != commentDto.UUID || commentDto.Body == null)
            {
                return BadRequest();
            }

            return Ok(await _commentService.UpdateComment(commentDto, HttpContext.User.Identity.Name));
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteComment(string id)
        {
            return Ok(await _commentService.DeleteComment(id, HttpContext.User.Identity.Name));
        }
    }
}
