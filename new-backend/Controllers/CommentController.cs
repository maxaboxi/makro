using Microsoft.AspNetCore.Mvc;
using Makro.Services;
using Microsoft.AspNetCore.Authorization;
using Makro.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
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
        public async Task<ActionResult<IEnumerable<Comment>>> GetAllCommentsForAnswer(int id)
        {
            return await _commentService.GetAllCommentsForAnswer(id);
        }

        [HttpGet("article/{id}")]
        public async Task<ActionResult<IEnumerable<Comment>>> GetAllCommentsForArticle(int id)
        {
            return await _commentService.GetAllCommentsForArticle(id);
        }

        [HttpPost("addcomment")]
        public async Task<IActionResult> AddNewComment(Comment comment)
        {
            return Ok(await _commentService.AddNewComment(comment));
        }

        [HttpPut("updatecomment/{id}")]
        public async Task<IActionResult> UpdateComment(int id, Comment comment)
        {
            if (id != comment.Id)
            {
                return BadRequest();
            }

            return Ok(await _commentService.UpdateComment(comment));
        }

        [HttpDelete("deletecomment/{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            return Ok(await _commentService.DeleteComment(id));
        }
    }
}
