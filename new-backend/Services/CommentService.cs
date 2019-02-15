using Makro.Models;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Makro.DTO;
using System;
namespace Makro.Services
{
    public class CommentService
    {
        private readonly MakroContext _context;
        private readonly ILogger _logger;

        public CommentService(MakroContext context, ILogger<CommentService> logger)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<ActionResult<IEnumerable<Comment>>> GetAllCommentsByUser(string id)
        {
            return await _context.Comments.AsNoTracking().Where(c => c.User.UUID == id).ToListAsync();
        }

        public async Task<ResultDto> AddNewComment(Comment comment)
        {
            comment.UUID = Guid.NewGuid().ToString();
            _context.Add(comment);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Comment added succesfully");
        }

        public async Task<ResultDto> UpdateComment(Comment comment)
        {
            _context.Entry(comment).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Comment updated succesfully");
        }

        public async Task<ResultDto> DeleteComment(int id)
        {
            var comment = await _context.Comments.FindAsync(id);

            if (comment == null)
            {
                _logger.LogDebug("Comment not found with id: ", id);
                return new ResultDto(false, "Comment not found");
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Comment deleted succesfully");
        }
    }
}
