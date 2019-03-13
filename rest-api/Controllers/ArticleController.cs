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
    [Route("api/v2/article")]
    public class ArticleController : ControllerBase
    {
        private readonly ArticleService _articleService;
        public ArticleController(ArticleService articleService)
        {
            _articleService = articleService;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ArticleDto>>> GetAllArticles()
        {
            return await _articleService.GetAllArticles(HttpContext.User.Identity.Name);
        }

        [AllowAnonymous]
        [HttpGet("single/{id}")]
        public async Task<ActionResult<ArticleDto>> GetAllArticles(string id)
        {
            return await _articleService.GetOneArticle(id, HttpContext.User.Identity.Name);
        }

        [HttpGet("user")]
        public async Task<ActionResult<IEnumerable<ArticleDto>>> GetAllArticlesByUser()
        {
            return await _articleService.GetAllArticlesByUser(HttpContext.User.Identity.Name);
        }

        [HttpPost("new")]
        public async Task<IActionResult> AddNewArticle([FromForm]ArticleDto articleDto)
        {
            return Ok(await _articleService.AddNewArticle(articleDto, HttpContext.User.Identity.Name));
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateArticle(string id, [FromForm]ArticleDto articleDto)
        {
            if (id != articleDto.UUID)
            {
                return BadRequest();
            }

            return Ok(await _articleService.UpdateArticle(articleDto, HttpContext.User.Identity.Name));
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteArticle(string id)
        {
            return Ok(await _articleService.DeleteArticle(id, HttpContext.User.Identity.Name));
        }

        [HttpDelete("delete/multiple")]
        public ResultDto DeleteMultipleArticles([FromBody]List<string> articleIds)
        {
            return _articleService.DeleteMultipleArticles(articleIds, HttpContext.User.Identity.Name);
        }
    }
}
