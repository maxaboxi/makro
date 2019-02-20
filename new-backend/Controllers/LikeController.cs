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
