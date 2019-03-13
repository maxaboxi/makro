using Microsoft.AspNetCore.Mvc;
using Makro.Services;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Threading.Tasks;
using Makro.DTO;
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

        [HttpGet("user")]
        public async Task<ActionResult<IEnumerable<LikeDto>>> GetAllLikesByUser()
        {
            return await _likeService.GetAllLikesByUser(HttpContext.User.Identity.Name);
        }

        [HttpPost("new")]
        public async Task<IActionResult> AddNewLike([FromBody]LikeDto likeDto)
        {
            if (likeDto.AnswerUUID == null && likeDto.ArticleUUID == null && likeDto.CommentUUID == null && likeDto.SharedMealUUID == null)
            {
                return BadRequest();
            }

            if (likeDto.Value == 0 || likeDto.Value > 1 || likeDto.Value < -1)
            {
                return BadRequest();
            }

            return Ok(await _likeService.AddNewLike(likeDto, HttpContext.User.Identity.Name));
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateLike(string id, [FromBody]LikeDto likeDto)
        {
            if (likeDto.Value == 0 || likeDto.Value > 1 || likeDto.Value < -1)
            {
                return BadRequest();
            }

            if (likeDto.AnswerUUID == null && likeDto.ArticleUUID == null && likeDto.CommentUUID == null && likeDto.SharedMealUUID == null)
            {
                return BadRequest();
            }

            return Ok(await _likeService.UpdateLike(likeDto, HttpContext.User.Identity.Name));
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteLike(string id)
        {
            return Ok(await _likeService.DeleteLike(id, HttpContext.User.Identity.Name));
        }

        [HttpDelete("delete/multiple")]
        public ResultDto DeleteMultipleLikes([FromBody]List<string> likeIds)
        {
            return _likeService.DeleteMultipleLikes(likeIds, HttpContext.User.Identity.Name);
        }
    }
}
