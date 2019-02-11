﻿using Makro.Models;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Makro.DTO;
namespace Makro.Services
{
    public class FeedbackService
    {
        private readonly MakroContext _context;
        private readonly ILogger _logger;

        public FeedbackService(MakroContext context, ILogger logger)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<ActionResult<IEnumerable<Feedback>>> GetAllFeedbacks()
        {
            return await _context.Feedbacks.ToListAsync();
        }

        public async Task<ActionResult<IEnumerable<Feedback>>> GetAllFeedbacksByUser(User user)
        {
            return await _context.Feedbacks.Where(f => f.User.Id == user.Id || f.User.Username == user.Username).ToListAsync();
        }

        public async Task<ResultDto> AddNewFeedback(Feedback feedback)
        {
            _context.Add(feedback);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Feedback added succesfully");
        }

        public async Task<ResultDto> UpdateFeedback(Feedback feedback)
        {
            _context.Entry(feedback).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Feedback updated succesfully");
        }

        public async Task<ResultDto> DeleteFeedback(int id)
        {
            var feedback = await _context.Feedbacks.FindAsync(id);

            if (feedback == null)
            {
                _logger.LogDebug("Feedback not found with id: ", id);
                return new ResultDto(false, "Feedback not found");
            }

            _context.Feedbacks.Remove(feedback);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Feedback deleted succesfully");
        }
    }
}
