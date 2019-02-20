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
    [Route("api/v2/comment")]
    public class CommentController : ControllerBase
    {
        private readonly CommentService _commentService;
        public CommentController(CommentService commentService)
        {
            _commentService = commentService;
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
        public async Task<IActionResult> UpdateComment(int id, Comment comment)
        {
            if (id != comment.Id)
            {
                return BadRequest();
            }

            return Ok(await _commentService.UpdateComment(comment));
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            return Ok(await _commentService.DeleteComment(id));
        }
    }
}
