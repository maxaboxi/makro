using Makro.Models;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Makro.DTO;
using System;
namespace Makro.Services
{
    public class ArticleService
    {
        private readonly MakroContext _context;
        private readonly ILogger _logger;

        public ArticleService(MakroContext context, ILogger<ArticleService> logger)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<ActionResult<IEnumerable<Article>>> GetAllArticles()
        {
            return await _context.Articles.ToListAsync();
        }

        public async Task<ActionResult<IEnumerable<Article>>> GetAllArticlesByUser(string id)
        {
            return await _context.Articles.Where(a => a.User.UUID == id).ToListAsync();
        }

        public async Task<ResultDto> AddNewArticle(Article article)
        {
            article.UUID = Guid.NewGuid().ToString();
            _context.Add(article);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Article added succesfully");
        }

        public async Task<ResultDto> UpdateArticle(Article article)
        {
            _context.Entry(article).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Article updated succesfully");
        }

        public async Task<ResultDto> DeleteArticle(int id)
        {
            var article = await _context.Articles.FindAsync(id);

            if (article == null)
            {
                _logger.LogDebug("Article not found with id: ", id);
                return new ResultDto(false, "Article not found");
            }

            _context.Articles.Remove(article);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Article deleted succesfully");
        }
    }
}
