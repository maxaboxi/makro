using Microsoft.AspNetCore.Mvc;
using Makro.Services;
using Microsoft.AspNetCore.Authorization;
using Makro.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace Makro.Controllers
{
    [Authorize]
    [Route("api/v2/like")]
    public class LikeController : ControllerBase
    {
        private readonly LikeService _likeService;
        public LikeController(LikeService likeService)
        {
            _likeService = likeService;
        }

        [HttpGet("answer/{id}")]
        public async Task<ActionResult<IEnumerable<Like>>> GetAllLikesForAnswer(int id)
        {
            return await _likeService.GetAllLikesForAnswer(id);
        }

        [AllowAnonymous]
        [HttpGet("article/{id}")]
        public async Task<ActionResult<IEnumerable<Like>>> GetAllLikesForArticle(int id)
        {
            return await _likeService.GetAllLikesForArticle(id);
        }

        [HttpGet("comment/{id}")]
        public async Task<ActionResult<IEnumerable<Like>>> GetAllLikesForComment(int id)
        {
            return await _likeService.GetAllLikesForComment(id);
        }

        [HttpGet("sharedmeal/{id}")]
        public async Task<ActionResult<IEnumerable<Like>>> GetAllLikesForSharedMeal(int id)
        {
            return await _likeService.GetAllLikesForSharedMeal(id);
        }

        [HttpGet("user/{id}")]
        public async Task<ActionResult<IEnumerable<Like>>> GetAllLikesByUser(string id)
        {
            return await _likeService.GetAllLikesByUser(id);
        }

        [HttpPost("new")]
        public async Task<IActionResult> AddNewLike(Like like)
        {
            return Ok(await _likeService.AddNewLike(like));
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateLike(int id, Like like)
        {
            if (id != like.Id)
            {
                return BadRequest();
            }

            return Ok(await _likeService.UpdateLike(like));
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteLike(int id)
        {
            return Ok(await _likeService.DeleteLike(id));
        }
    }
}
