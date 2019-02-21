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
                q.Answers.ToList().ForEach(a => {
                    var answerDto = _mapper.Map<AnswerDto>(a);
                    var totalPoints = 0;
                    var likes = _context.Likes.Where(l => l.Answer == a).ToList();
                    likes.ForEach(like => totalPoints += like.Value);
                    answerDto.TotalPoints = totalPoints;
                    answerDtos.Add(answerDto);
                     });
                var questionDto = _mapper.Map<QuestionDto>(q);
                questionDto.Answers = answerDtos;
                questionDtos.Add(questionDto);
            });
            return questionDtos;
        }

        public async Task<ActionResult<QuestionDto>> GetOneQuestion(string id)
        {
            var question = await _context.Questions.Where(q => q.UUID == id).Include(q => q.User)
                .Include(q => q.Answers)
                    .ThenInclude(a => a.User)
                .Include(q => q.Answers)
                    .ThenInclude(a => a.Comments)
                        .ThenInclude(c => c.User)
                .AsNoTracking().FirstOrDefaultAsync();

            List<AnswerDto> answerDtos = new List<AnswerDto>();

            question.Answers.ToList().ForEach(a =>
            {
                var answerDto = _mapper.Map<AnswerDto>(a);
                var totalPoints = 0;
                var likes = _context.Likes.Where(l => l.Answer == a).ToList();
                likes.ForEach(like => totalPoints += like.Value);
                List<CommentDto> commentDtos = new List<CommentDto>();
                a.Comments.ToList().ForEach(c => {
                    var commentDto = _mapper.Map<CommentDto>(c);
                    var totalPointsComment = 0;
                    var likesComment = _context.Likes.Where(l => l.Comment == c).ToList();
                    likesComment.ForEach(like => totalPointsComment += like.Value);
                    commentDto.CommentReplyCount = _context.Comments.Where(com => com.ReplyTo == c).Count();
                    commentDto.TotalPoints = totalPointsComment;
                    commentDtos.Add(commentDto);
                 });
                answerDto.Comments = commentDtos;
                answerDto.TotalPoints = totalPoints;
                answerDtos.Add(answerDto);
            });

            var questionDto = _mapper.Map<QuestionDto>(question);
            questionDto.Answers = answerDtos;

            return questionDto;
        }

        public async Task<ActionResult<IEnumerable<QuestionDto>>> GetAllQuestionsByUser(string userId)
        {
            List<QuestionDto> questionDtos = new List<QuestionDto>();
            var questions = await _context.Questions.Where(q => q.User.UUID == userId)
                .Include(q => q.User)
                .AsNoTracking().ToListAsync();
            questions.ForEach(q => questionDtos.Add(_mapper.Map<QuestionDto>(q)));
            return questionDtos;
        }

        public async Task<ResultDto> AddNewQuestion(QuestionDto questionDto, string userId)
        {
            var question = _mapper.Map<Question>(questionDto);
            question.UUID = Guid.NewGuid().ToString();
            question.CreatedAt = DateTime.Now;
            question.UpdatedAt = DateTime.Now;
            question.User = await _context.Users.Where(u => u.UUID == userId).FirstOrDefaultAsync();
            _context.Add(question);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Question added succesfully");
        }

        public async Task<ResultDto> UpdateQuestion(QuestionDto questionDto, string userId)
        {
            var originalQuestion = await _context.Questions
                .Where(q => q.UUID == questionDto.UUID && q.User.UUID == userId).FirstOrDefaultAsync();

            if (originalQuestion == null)
            {
                _logger.LogDebug("Question not found with id: " + questionDto.UUID + " and with userId " + userId);
                return new ResultDto(false, "Question not found");
            }

            originalQuestion.UpdatedAt = DateTime.Now;
            originalQuestion.QuestionBody = questionDto.QuestionBody ?? originalQuestion.QuestionBody;
            originalQuestion.QuestionInformation = questionDto.QuestionInformation ?? originalQuestion.QuestionInformation;
            originalQuestion.Tags = questionDto.Tags ?? originalQuestion.Tags;

            _context.Entry(originalQuestion).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Question updated succesfully");
        }

        public async Task<ResultDto> DeleteQuestion(string id, string userId)
        {
            var question = await _context.Questions.Where(q => q.UUID == id).Include(q => q.User).FirstOrDefaultAsync();

            if (question == null)
            {
                _logger.LogDebug("Question not found with id: " + id);
                return new ResultDto(false, "Question not found");
            }

            if (question.User.UUID != userId)
            {
                _logger.LogError("User with UUID " + userId + " tried to delete question which belnogs to " + question.User.UUID);
                return new ResultDto(false, "Unauthorized");
            }

            _context.Questions.Remove(question);
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Question deleted succesfully");
        }
    }
}
