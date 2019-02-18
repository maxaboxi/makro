using Makro.Models;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Makro.DTO;
using System;
namespace Makro.Services
{
    public class FeedbackService
    {
        private readonly MakroContext _context;
        private readonly ILogger _logger;

        public FeedbackService(MakroContext context, ILogger<FeedbackService> logger)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<ActionResult<IEnumerable<FeedbackDto>>> GetAllFeedbacks()
        {
            var feedbacks = await _context.Feedbacks.Include(f => f.User).Include(f => f.AnsweredBy).AsNoTracking().ToListAsync();
            var feedbackDtos = new List<FeedbackDto>();
            feedbacks.ForEach(f => {
                var feedbackDto = new FeedbackDto
                {
                    UUID = f.UUID,
                    UserId = f.Anonymous ? null : f.User.UUID,
                    FeedbackBody = f.FeedbackBody,
                    Answer = f.Answer,
                    AnsweredBy = f.AnsweredBy?.UUID,
                    CreatedAt = f.CreatedAt,
                    UpdatedAt = f.UpdatedAt,
                    AnsweredAt = f.AnsweredAt
                };
                feedbackDtos.Add(feedbackDto);
            });
            return feedbackDtos;
        }

        public async Task<ActionResult<IEnumerable<Feedback>>> GetAllFeedbacksByUser(string id)
        {
            return await _context.Feedbacks.AsNoTracking().Where(f => f.User.UUID == id).ToListAsync();
        }

        public async Task<ResultDto> AddNewFeedback(FeedbackDto feedbackDto, string userId)
        {
            var feedback = new Feedback
            {
                User = _context.Users.Where(u => u.UUID == userId).FirstOrDefault(),
                FeedbackBody = feedbackDto.FeedbackBody,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                UUID = Guid.NewGuid().ToString(),
                Anonymous = feedbackDto.UserId == null
            };
            _context.Add(feedback);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Feedback added succesfully");
        }

        public async Task<ResultDto> UpdateFeedback(FeedbackDto feedbackDto, string userId)
        {
            var originalFeedback = await _context.Feedbacks.Where(f => f.UUID == feedbackDto.UUID)
                .Include(f => f.User)
                .FirstOrDefaultAsync();

            if (originalFeedback == null)
            {
                return new ResultDto(false, "Feedback not found");
            }

            originalFeedback.UpdatedAt = DateTime.Now;
            originalFeedback.FeedbackBody = feedbackDto.FeedbackBody;
            _context.Entry(originalFeedback).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Feedback updated succesfully");
        }

        public async Task<ResultDto> DeleteFeedback(string id, string userId)
        {
            var feedback = await _context.Feedbacks.Include(f => f.User).Where(f => f.UUID == id).FirstOrDefaultAsync();

            if (feedback == null)
            {
                _logger.LogDebug("Feedback not found with id: ", id);
                return new ResultDto(false, "Feedback not found");
            }

            if (feedback.User == null)
            {
                var user = await _context.Users.Where(u => u.UUID == userId).FirstOrDefaultAsync();
                if (user.Roles.IndexOf("admin") == -1)
                {
                    return new ResultDto(false, "Unauthorized");
                }
            }

            _context.Feedbacks.Remove(feedback);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Feedback deleted succesfully");
        }
    }
}
