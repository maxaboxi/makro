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
    public class AnswerService
    {
        private readonly MakroContext _context;
        private readonly ILogger _logger;
        private readonly IMapper _mapper;

        public AnswerService(MakroContext context, ILogger<AnswerService> logger, IMapper mapper)
        {
            _logger = logger;
            _context = context;
            _mapper = mapper;
        }

        public async Task<ActionResult<IEnumerable<AnswerDto>>> GetAllAnswersByUser(string userId)
        {
            List<AnswerDto> answerDtos = new List<AnswerDto>();
            var answers = await _context.Answers.AsNoTracking().Where(a => a.User.UUID == userId).Include(a => a.User).ToListAsync();
            answers.ForEach(a => answerDtos.Add(_mapper.Map<AnswerDto>(a)));
            return answerDtos;
        }

        public async Task<ResultDto> AddNewAnswer(AnswerDto answerDto, string userId)
        {
            var answer = _mapper.Map<Answer>(answerDto);
            answer.UUID = Guid.NewGuid().ToString();
            answer.CreatedAt = DateTime.Now;
            answer.UpdatedAt = DateTime.Now;
            answer.User = await _context.Users.Where(u => u.UUID == userId).FirstOrDefaultAsync();
            answer.Question = await _context.Questions.Where(q => q.UUID == answerDto.QuestionUUID).FirstOrDefaultAsync();
            _context.Add(answer);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Answer added succesfully");
        }

        public async Task<ResultDto> UpdateAnswer(AnswerDto answerDto, string userId)
        {
            var originalAnswer = await _context.Answers.Where(a => a.UUID == answerDto.UUID && a.User.UUID == userId).FirstOrDefaultAsync();

            if (originalAnswer == null)
            {
                _logger.LogDebug("Answer not found with id: " + answerDto.UUID + " and with userId " + userId);
                return new ResultDto(true, "Answer not found");
            }

            originalAnswer.UpdatedAt = DateTime.Now;
            originalAnswer.AnswerBody = answerDto.AnswerBody ?? originalAnswer.AnswerBody;

            _context.Entry(originalAnswer).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Answer updated succesfully");
        }

        public async Task<ResultDto> DeleteAnswer(string id, string userId)
        {
            var answer = await _context.Answers.Where(a => a.UUID == id && a.User.UUID == userId).FirstOrDefaultAsync();

            if (answer == null)
            {
                _logger.LogDebug("Answer not found with id: " + id + " and with userId " + userId);
                return new ResultDto(false, "Answer not found");
            }

            _context.Answers.Remove(answer);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Answer deleted succesfully");
        }
    }
}
