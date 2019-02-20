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

        public async Task<ResultDto> AddNewLike(Like like)
        {
            like.UUID = Guid.NewGuid().ToString();
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
