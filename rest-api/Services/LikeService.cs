using Makro.Models;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Makro.DTO;
using System;
using AutoMapper;
namespace Makro.Services
{
    public class LikeService
    {
        private readonly MakroContext _context;
        private readonly ILogger _logger;
        private readonly IMapper _mapper;

        public LikeService(MakroContext context, ILogger<LikeService> logger, IMapper mapper)
        {
            _logger = logger;
            _context = context;
            _mapper = mapper;
        }

        public async Task<ActionResult<IEnumerable<LikeDto>>> GetAllLikesByUser(string id)
        {
            var likes = await _context.Likes.AsNoTracking().Where(l => l.User.UUID == id)
                .Include(l => l.User)
                .Include(l => l.Answer)
                .Include(l => l.Article)
                .Include(l => l.Comment)
                .Include(l => l.SharedMeal)
                .ToListAsync();
            List<LikeDto> likeDtos = new List<LikeDto>();

            likes.ForEach(l => {
                var likeDto = _mapper.Map<LikeDto>(l);
                likeDto.LikedContent = l.Article?.Title ?? l.Answer?.AnswerBody ?? l.Comment?.Body ?? l.SharedMeal?.Name;
                likeDtos.Add(likeDto);
            });

            return likeDtos;
        }

        public async Task<ResultDto> AddNewLike(LikeDto likeDto, string userId)
        {
            var like = _mapper.Map<Like>(likeDto);
            like.UUID = Guid.NewGuid().ToString();
            like.User = await _context.Users.Where(u => u.UUID == userId).FirstOrDefaultAsync();
            like.CreatedAt = DateTime.Now;
            like.UpdatedAt = DateTime.Now;
            var unique = CheckUnique(userId, likeDto.AnswerUUID ?? likeDto.ArticleUUID ?? likeDto.CommentUUID ?? likeDto.SharedMealUUID);

            if (unique)
            {
                if (likeDto.AnswerUUID != null)
                {
                    like.Answer = await _context.Answers.Where(a => a.UUID == likeDto.AnswerUUID)
                        .FirstOrDefaultAsync();
                }
                else if (likeDto.ArticleUUID != null)
                {
                    like.Article = await _context.Articles.Where(a => a.UUID == likeDto.ArticleUUID)
                        .FirstOrDefaultAsync();
                }
                else if (likeDto.CommentUUID != null)
                {
                    like.Comment = await _context.Comments.Where(c => c.UUID == likeDto.CommentUUID)
                        .FirstOrDefaultAsync();
                }
                else
                {
                    like.SharedMeal = await _context.SharedMeals.Where(sm => sm.UUID == likeDto.SharedMealUUID)
                        .FirstOrDefaultAsync();
                }

                if ( like.Answer == null && like.Article == null && like.Comment == null && like.SharedMeal == null)
                {
                    return new ResultDto(false, "Content not found");
                }

                _context.Add(like);
                await _context.SaveChangesAsync();

                return new ResultDto(true, "Like added succesfully");
            }

            return new ResultDto(false, "Already liked");

        }

        public async Task<ResultDto> UpdateLike(LikeDto likeDto, string userId)
        {
            Like originalLike;
            if (likeDto.AnswerUUID != null)
            {
                originalLike = await _context.Likes.Where(l => l.User.UUID == userId && l.Answer.UUID == likeDto.AnswerUUID)
                    .FirstOrDefaultAsync();
            } else if (likeDto.ArticleUUID != null)
            {
                originalLike = await _context.Likes.Where(l => l.User.UUID == userId && l.Article.UUID == likeDto.ArticleUUID)
                    .FirstOrDefaultAsync();
            } else if (likeDto.CommentUUID != null)
            {
                originalLike = await _context.Likes.Where(l => l.User.UUID == userId && l.Comment.UUID == likeDto.CommentUUID)
                    .FirstOrDefaultAsync();
            }
            else
            {
                originalLike = await _context.Likes.Where(l => l.User.UUID == userId && l.SharedMeal.UUID == likeDto.SharedMealUUID)
                    .FirstOrDefaultAsync();
            }

            if (originalLike == null)
            {
                _logger.LogDebug("Like not found with id: " + likeDto.UUID + " and with userId " + userId);
                return new ResultDto(false, "Like not found");
            }
            originalLike.UpdatedAt = DateTime.Now;
            originalLike.Value = likeDto.Value;
            
            _context.Entry(originalLike).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Like updated succesfully");
        }

        public async Task<ResultDto> DeleteLike(string id, string userId)
        {
            var like = await _context.Likes.Where(l => l.User.UUID == userId && l.UUID == id).FirstOrDefaultAsync();

            if (like == null)
            {
                _logger.LogDebug("Like not found with id: " + id + " and with userId " + userId);
                return new ResultDto(false, "Like not found");
            }

            _context.Likes.Remove(like);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Like deleted succesfully");
        }

        public ResultDto DeleteMultipleLikes(List<string> likeIds, string userId)
        {
            likeIds.ForEach(likeId => { 
                var like = _context.Likes.Where(l => l.User.UUID == userId && l.UUID == likeId).FirstOrDefault();

                if (like == null)
                {
                    _logger.LogDebug("Like not found with id: " + likeId + " and with userId " + userId);
                }

                _context.Likes.Remove(like);
                _context.SaveChanges();
            });
            return new ResultDto(true, "Likes deleted succesfully");
        }

        private bool CheckUnique(string userId, string uuidToCheck)
        {
            var likes = _context.Likes.Where(l => l.User.UUID == userId)
                .Include(l => l.Answer)
                .Include(l => l.Article)
                .Include(l => l.Comment)
                .Include(l => l.SharedMeal).ToList();
            var unique = true;
            likes.ForEach(l =>
            {
                unique &= l.Answer?.UUID != uuidToCheck && l.Article?.UUID != uuidToCheck
                            && l.Comment?.UUID != uuidToCheck && l.SharedMeal?.UUID != uuidToCheck;
            });

            return unique;
        }
    }
}
