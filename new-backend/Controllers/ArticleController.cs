using Microsoft.AspNetCore.Mvc;
using Makro.Services;
using Microsoft.AspNetCore.Authorization;
using Makro.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
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
        public async Task<ActionResult<IEnumerable<Article>>> GetAllArticles()
        {
            return await _articleService.GetAllArticles();
        }

        [HttpGet("user/{id}")]
        public async Task<ActionResult<IEnumerable<Article>>> GetAllAnswerByUser(string id)
        {
            return await _articleService.GetAllArticlesByUser(id);
        }

        [HttpPost("addarticle")]
        public async Task<IActionResult> AddNewArticle(Article article)
        {
            return Ok(await _articleService.AddNewArticle(article));
        }

        [HttpPut("updatearticle/{id}")]
        public async Task<IActionResult> UpdateArticle(int id, Article article)
        {
            if (id != article.Id)
            {
                return BadRequest();
            }

            return Ok(await _articleService.UpdateArticle(article));
        }

        [HttpDelete("deletarticle/{id}")]
        public async Task<IActionResult> DeleteArticle(int id)
        {
            return Ok(await _articleService.DeleteArticle(id));
        }
    }
}
