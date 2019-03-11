using Makro.DB;
using Makro.Models;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Makro.DTO;
using System;
using AutoMapper;
using System.IO;
namespace Makro.Services
{
    public class ArticleService
    {
        private readonly MakroContext _context;
        private readonly ILogger _logger;
        private readonly IMapper _mapper;

        public ArticleService(MakroContext context, ILogger<ArticleService> logger, IMapper mapper)
        {
            _logger = logger;
            _context = context;
            _mapper = mapper;
        }

        public async Task<ActionResult<IEnumerable<ArticleDto>>> GetAllArticles(string userId)
        {
            var articles = await _context.Articles.AsNoTracking()
                .Include(a => a.User)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();

            List<ArticleDto> articleDtos = new List<ArticleDto>();
            articles.ForEach(a =>
            {
                var articleDto = _mapper.Map<ArticleDto>(a);
                var totalPoints = 0;
                var likes = _context.Likes.AsNoTracking().Where(l => l.Article == a).Include(l => l.User).ToList();
                likes.ForEach(like => {
                    totalPoints += like.Value;
                    if (like.User.UUID == userId)
                    {
                        articleDto.UserLike = like.Value;
                    }
                });

                articleDto.TotalPoints = totalPoints;
                articleDtos.Add(articleDto);
            });

            return articleDtos;
        }

        public async Task<ActionResult<ArticleDto>> GetOneArticle(string id, string userId)
        {
            var article = await _context.Articles.AsNoTracking()
                .Where(a => a.UUID == id)
                .Include(a => a.User)
                .Include(a => a.Comments)
                    .ThenInclude(c => c.User)
                .Include(a => a.Comments)
                    .ThenInclude(c => c.ReplyTo)
                .FirstOrDefaultAsync();

            var totalPoints = 0;
            var articleDto = _mapper.Map<ArticleDto>(article);
            var likes = _context.Likes.AsNoTracking().Where(l => l.Article == article).Include(l => l.User).ToList();
            likes.ForEach(like => {
                totalPoints += like.Value;
                if (userId != null && like.User.UUID == userId)
                {
                    articleDto.UserLike = like.Value;
                }
            });
            articleDto.TotalPoints = totalPoints;

            List<CommentDto> commentDtos = new List<CommentDto>();
            article.Comments.ToList().ForEach(c =>
            {
                var commentDto = _mapper.Map<CommentDto>(c);
                var totalPointsComment = 0;
                var likesComment = _context.Likes.AsNoTracking().Where(l => l.Comment == c).Include(l => l.User).ToList();
                likesComment.ForEach(like => {
                    totalPointsComment += like.Value;
                    if (userId != null && like.User.UUID == userId)
                    {
                        commentDto.UserLike = like.Value;
                    }
                });
                commentDto.CommentReplyCount = _context.Comments.Where(com => com.ReplyTo == c).Count();
                commentDto.TotalPoints = totalPointsComment;
                commentDto.ReplyToUUID = c.ReplyTo?.UUID;
                commentDto.ReplyToUser = c.ReplyTo?.User.Username;
                commentDtos.Add(commentDto);
            });

            articleDto.Comments = commentDtos;

            return articleDto;
        }

        public async Task<ActionResult<IEnumerable<ArticleDto>>> GetAllArticlesByUser(string id)
        {
            List<Article> articles = await _context.Articles.AsNoTracking().Where(a => a.User.UUID == id).Include(a => a.User).ToListAsync();
            List<ArticleDto> articleDtos = new List<ArticleDto>();
            articles.ForEach(a => articleDtos.Add(_mapper.Map<ArticleDto>(a)));
            return articleDtos;
        }

        public async Task<ResultDto> AddNewArticle(ArticleDto articleDto, string userId)
        {
            if (articleDto.HeaderImage != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await articleDto.HeaderImage.CopyToAsync(memoryStream);
                    articleDto.Image = memoryStream.ToArray();
                }
            }

            var article = _mapper.Map<Article>(articleDto);
            article.UUID = Guid.NewGuid().ToString();
            article.User = await _context.Users.Where(u => u.UUID == userId).FirstOrDefaultAsync();
            article.CreatedAt = DateTime.Now;
            article.UpdatedAt = DateTime.Now;
            _context.Add(article);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Article added succesfully");
        }

        public async Task<ResultDto> UpdateArticle(ArticleDto articleDto, string userId)
        {
            var article = await _context.Articles.Where(a => a.User.UUID == userId && a.UUID == articleDto.UUID).FirstOrDefaultAsync();

            if (article == null)
            {
                return new ResultDto(false, "Article not found");
            }

            using (var memoryStream = new MemoryStream())
            {
                await articleDto.HeaderImage.CopyToAsync(memoryStream);
                articleDto.Image = memoryStream.ToArray();
            }

            _context.Entry(article).State = EntityState.Modified;
            article.Body = articleDto.Body;
            article.Title = articleDto.Title;
            article.Image = articleDto.Image;
            article.Tags = articleDto.Tags;
            article.UpdatedAt = DateTime.Now;
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Article updated succesfully");
        }

        public async Task<ResultDto> DeleteArticle(string id, string userId)
        {
            var article = await _context.Articles.Where(a => a.UUID == id && a.User.UUID == userId).FirstOrDefaultAsync();

            if (article == null)
            {
                _logger.LogDebug("Article not found with id: ", id);
                return new ResultDto(false, "Article not found");
            }

            _context.Likes.RemoveRange(_context.Likes.Where(l => l.Article.Id == article.Id));
            _context.Articles.Remove(article);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Article deleted succesfully");
        }

        public ResultDto DeleteMultipleArticles(List<string> articleIds, string userId)
        {
            articleIds.ForEach(articleId => {
                var article = _context.Articles.Where(a => a.UUID == articleId && a.User.UUID == userId).FirstOrDefault();

                if (article == null)
                {
                    _logger.LogDebug("Article not found with id: ", articleId);
                }

                _context.Likes.RemoveRange(_context.Likes.Where(l => l.Article.Id == article.Id));
                _context.Articles.Remove(article);
                _context.SaveChanges();
            });
            return new ResultDto(true, "Articles deleted succesfully");
        }
    }
}
