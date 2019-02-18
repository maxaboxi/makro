using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Makro.Models;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Makro.DTO;
using System;
using AutoMapper;
namespace Makro.Services
{
    public class QuestionService
    {
        private readonly MakroContext _context;
        private readonly ILogger _logger;
        private readonly IMapper _mapper;

        public QuestionService(MakroContext context, ILogger<QuestionService> logger, IMapper mapper)
        {
            _logger = logger;
            _context = context;
            _mapper = mapper;
        }

        public async Task<ActionResult<IEnumerable<QuestionDto>>> GetAllQuestions()
        {
            List<QuestionDto> questionDtos = new List<QuestionDto>();

            var questions = await _context.Questions.Include(q => q.User)
            .Include(q => q.Answers)
                .ThenInclude(a => a.User)
            .AsNoTracking().ToListAsync();

            questions.ForEach(q =>
            {
                List<AnswerDto> answerDtos = new List<AnswerDto>();
                q.Answers.ToList().ForEach(a => answerDtos.Add(_mapper.Map<AnswerDto>(a)));
                var questionDto = _mapper.Map<QuestionDto>(q);
                questionDto.Answers = answerDtos;
                questionDtos.Add(questionDto);
            });
            return questionDtos;
        }

        public async Task<ActionResult<IEnumerable<Question>>> GetAllQuestionsByUser(string userId)
        {
            return await _context.Questions.AsNoTracking().Where(q => q.User.UUID == userId).ToListAsync();
        }

        public async Task<ResultDto> AddNewQuestion(Question question)
        {
            question.UUID = Guid.NewGuid().ToString();
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
