using Makro.Models;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Makro.DTO;
namespace Makro.Services
{
    public class AnswerService
    {
        private readonly MakroContext _context;
        private readonly ILogger _logger;

        public AnswerService(MakroContext context, ILogger<AnswerService> logger)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<ActionResult<IEnumerable<Answer>>> GetAllAnswersForQuestion(int id)
        {
            return await _context.Answers.Where(a => a.Question.Id == id).ToListAsync();
        }

        public async Task<ActionResult<IEnumerable<Answer>>> GetAllAnswersByUser(string userId)
        {
            return await _context.Answers.Where(a => a.User.UUID == userId).ToListAsync();
        }

        public async Task<ResultDto> AddNewAnswer(Answer answer)
        {
            _context.Add(answer);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Answer added succesfully");
        }

        public async Task<ResultDto> UpdateAnswer(Answer answer)
        {
            _context.Entry(answer).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Answer updated succesfully");
        }

        public async Task<ResultDto> DeleteAnswer(int id)
        {
            var answer = await _context.Answers.FindAsync(id);

            if (answer == null)
            {
                _logger.LogDebug("Answer not found with id: ", id);
                return new ResultDto(false, "Answer not found");
            }

            _context.Answers.Remove(answer);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Answer deleted succesfully");
        }
    }
}
