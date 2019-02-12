using Makro.Models;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Makro.DTO;
namespace Makro.Services
{
    public class LikeService
    {
        private readonly MakroContext _context;
        private readonly ILogger _logger;

        public LikeService(MakroContext context, ILogger<LikeService> logger)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<ActionResult<IEnumerable<Like>>> GetAllLikesForAnswer(int id)
        {
            return await _context.Likes.Where(l => l.Answer.Id == id).ToListAsync();
        }

        public async Task<ActionResult<IEnumerable<Like>>> GetAllLikesForArticle(int id)
        {
            return await _context.Likes.Where(l => l.Article.Id == id).ToListAsync();
        }

        public async Task<ActionResult<IEnumerable<Like>>> GetAllLikesForComment(int id)
        {
            return await _context.Likes.Where(l => l.Comment.Id == id).ToListAsync();
        }

        public async Task<ActionResult<IEnumerable<Like>>> GetAllLikesForSharedMeal(int id)
        {
            return await _context.Likes.Where(l => l.SharedMeal.Id == id).ToListAsync();
        }

        public async Task<ActionResult<IEnumerable<Like>>> GetAllLikesByUser(string id)
        {
            return await _context.Likes.Where(l => l.User.UUID == id).ToListAsync();
        }

        public async Task<ResultDto> AddNewLike(Like like)
        {
            _context.Add(like);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Like added succesfully");
        }

        public async Task<ResultDto> UpdateLike(Like like)
        {
            _context.Entry(like).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Like updated succesfully");
        }

        public async Task<ResultDto> DeleteLike(int id)
        {
            var like = await _context.Likes.FindAsync(id);

            if (like == null)
            {
                _logger.LogDebug("Like not found with id: ", id);
                return new ResultDto(false, "Like not found");
            }

            _context.Likes.Remove(like);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Like deleted succesfully");
        }
    }
}
