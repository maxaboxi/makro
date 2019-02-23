using Makro.Models;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Makro.DTO;
using System;
using AutoMapper;
namespace Makro.Services
{
    public class CommentService
    {
        private readonly MakroContext _context;
        private readonly ILogger _logger;
        private readonly IMapper _mapper;

        public CommentService(MakroContext context, ILogger<CommentService> logger, IMapper mapper)
        {
            _logger = logger;
            _context = context;
            _mapper = mapper;
        }

        public async Task<ActionResult<IEnumerable<CommentDto>>> GetAllCommentsForAnswer(string id, string userId)
        {
            var comments = await _context.Comments.AsNoTracking().Where(c => c.Answer.UUID == id)
                .Include(c => c.User)
                .Include(c => c.Answer)
                .Include(c => c.ReplyTo)
                    .ThenInclude(r => r.User)
                .ToListAsync();
            List<CommentDto> commentDtos = new List<CommentDto>();
            comments.ForEach(c => {
                var dto = _mapper.Map<CommentDto>(c);
                var likes = _context.Likes.AsNoTracking().Where(l => l.Comment == c).Include(l => l.User).ToList();
                var totalPoints = 0;
                likes.ForEach(like => {
                    totalPoints += like.Value;
                    if (like.User.UUID == userId)
                    {
                        dto.UserLike = like.Value;
                    }
                });
                dto.AnswerUUID = c.Answer?.UUID;
                dto.ReplyToUUID = c.ReplyTo?.UUID;
                dto.ReplyToUser = c.ReplyTo?.User.Username;
                dto.TotalPoints = totalPoints;
                commentDtos.Add(dto);
            });
            return commentDtos;
        }

        public async Task<ActionResult<IEnumerable<CommentDto>>> GetAllCommentsForArticle(string id, string userId)
        {
            var comments = await _context.Comments.AsNoTracking().Where(c => c.Article.UUID == id)
                .Include(c => c.User)
                .Include(c => c.Article)
                .Include(c => c.ReplyTo)
                    .ThenInclude(r => r.User)
                .ToListAsync();
            List<CommentDto> commentDtos = new List<CommentDto>();
            comments.ForEach(c => {
                var dto = _mapper.Map<CommentDto>(c);
                var likes = _context.Likes.AsNoTracking().Where(l => l.Comment == c).Include(l => l.User).ToList();
                var totalPoints = 0;
                likes.ForEach(like => {
                    totalPoints += like.Value;
                    if (like.User.UUID == userId)
                    {
                        dto.UserLike = like.Value;
                    }
                });
                dto.AnswerUUID = c.Answer?.UUID;
                dto.ReplyToUUID = c.ReplyTo?.UUID;
                dto.ReplyToUser = c.ReplyTo?.User.Username;
                dto.TotalPoints = totalPoints;
                commentDtos.Add(dto);
            });
            return commentDtos;
        }

        public async Task<ActionResult<IEnumerable<CommentDto>>> GetAllCommentsByUser(string id)
        {
            var comments = await _context.Comments.AsNoTracking().Where(c => c.User.UUID == id).Include(c => c.User).ToListAsync();
            List<CommentDto> commentDtos = new List<CommentDto>();
            comments.ForEach(c => commentDtos.Add(_mapper.Map<CommentDto>(c)));
            return commentDtos;
        }

        public async Task<ResultDto> AddNewComment(CommentDto commentDto, string userId)
        {
            var user = await _context.Users.Where(u => u.UUID == userId).FirstOrDefaultAsync();
            var comment = _mapper.Map<Comment>(commentDto);

            if (commentDto.AnswerUUID != null)
            {
                comment.Answer = _context.Answers.Where(a => a.UUID == commentDto.AnswerUUID).FirstOrDefault();
            } else if (commentDto.ArticleUUID != null)
            {
                comment.Article = _context.Articles.Where(a => a.UUID == commentDto.ArticleUUID).FirstOrDefault();
            }

            if (commentDto.ReplyToUUID != null)
            {
                comment.ReplyTo = _context.Comments.Where(c => c.UUID == commentDto.ReplyToUUID).FirstOrDefault();
            }

            comment.CreatedAt = DateTime.Now;
            comment.UpdatedAt = DateTime.Now;
            comment.User = user;
            comment.UUID = Guid.NewGuid().ToString();
            _context.Add(comment);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Comment added succesfully");
        }

        public async Task<ResultDto> UpdateComment(CommentDto commentDto, string userId)
        {
            var originalComment = await _context.Comments.Where(c => c.UUID == commentDto.UUID && c.User.UUID == userId).FirstOrDefaultAsync();
            if (originalComment == null)
            {
                _logger.LogDebug("Comment not found with id: " + commentDto.UUID + " and with userId " + userId);
                return new ResultDto(false, "Comment not found");
            }

            originalComment.Body = commentDto.Body ?? originalComment.Body;
            originalComment.UpdatedAt = DateTime.Now;
            _context.Entry(originalComment).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Comment updated succesfully");
        }

        public async Task<ResultDto> DeleteComment(string id, string userId)
        {
            var comment = await _context.Comments.Where(c => c.UUID == id && c.User.UUID == userId).FirstOrDefaultAsync();

            if (comment == null)
            {
                _logger.LogDebug("Comment not found with id: " + id + " and with userId " + userId);
                return new ResultDto(false, "Comment not found");
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Comment deleted succesfully");
        }
    }
}
