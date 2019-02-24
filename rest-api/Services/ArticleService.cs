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
                .Include(a => a.Images)
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
                List<ArticleImageDto> images = new List<ArticleImageDto>();
                a.Images.ToList().ForEach(img => images.Add(_mapper.Map<ArticleImageDto>(img)));
                articleDto.Images = images;
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
                .Include(a => a.Images)
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

            List<ArticleImageDto> images = new List<ArticleImageDto>();
            article.Images.ToList().ForEach(img => images.Add(_mapper.Map<ArticleImageDto>(img)));
            articleDto.Images = images;

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

        public async Task<ActionResult<IEnumerable<Article>>> GetAllArticlesByUser(string id)
        {
            return await _context.Articles.AsNoTracking().Where(a => a.User.UUID == id).ToListAsync();
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
