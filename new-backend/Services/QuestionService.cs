using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Makro.Models;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Makro.DTO;
namespace Makro.Services
{
    public class QuestionService
    {
        private readonly MakroContext _context;
        private readonly ILogger _logger;

        public QuestionService(MakroContext context, ILogger<QuestionService> logger)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<ActionResult<IEnumerable<Question>>> GetAllQuestions()
        {
            return await _context.Questions.ToListAsync();
        }

        public async Task<ActionResult<IEnumerable<Question>>> GetAllQuestionsByUser(string userId)
        {
            return await _context.Questions.Where(q => q.User.ObjectId == userId).ToListAsync();
        }

        public async Task<ResultDto> AddNewQuestion(Question question)
        {
            _context.Add(question);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Question added succesfully");
        }

        public async Task<ResultDto> UpdateQuestion(Question question)
        {
            _context.Entry(question).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Question updated succesfully");
        }

        public async Task<ResultDto> DeleteQuestion(int id)
        {
            var question = await _context.Questions.FindAsync(id);

            if (question == null)
            {
                _logger.LogDebug("Question not found with id: ", id);
                return new ResultDto(false, "Question not found");
            }

            _context.Questions.Remove(question);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Question deleted succesfully");
        }
    }
}
