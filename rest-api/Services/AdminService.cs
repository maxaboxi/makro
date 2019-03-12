using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Makro.Models;
using Makro.DB;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using AutoMapper;
using Makro.DTO;
using System;
namespace Makro.Services
{
    public class AdminService
    {
        private readonly MakroContext _context;
        private readonly IMapper _mapper;
        public AdminService(MakroContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
        {
            return await _context.Users.AsNoTracking()
                .Select(u => new User { UUID = u.UUID, Username = u.Username, LastLogin = u.LastLogin })
                .OrderByDescending(u => u.LastLogin)
                .ToListAsync();
        }

        public async Task<ActionResult<User>> GetUserInformation(string id)
        {
            var user = await _context.Users.Include(u => u.MealNames).Where(p => p.UUID == id).FirstOrDefaultAsync();

            if (user != null)
            {
                user.Password = null;
                user.MealNames.Reverse(0, user.MealNames.Count);
                return user;
            }

            return null;
        }

        public ResultDto DeleteMultipleUsers(List<string> userIds)
        {
            userIds.ForEach(id => {
                var user = _context.Users.Where(u => u.UUID == id).FirstOrDefault();
                if (user != null)
                {
                    _context.Meals.RemoveRange(_context.Meals.Where(m => m.User == user));
                    _context.Users.Remove(user);
                    _context.SaveChanges();
                }

            });

            return new ResultDto(true, "Days deleted succesfully");
        }

        public async Task<ResultDto> AnswerToFeedback(FeedbackDto feedbackDto, string userId)
        {
            var feedback = await _context.Feedbacks.Where(f => f.UUID == feedbackDto.UUID).FirstOrDefaultAsync();
            if (feedback != null)
            {
                feedback.AnsweredAt = DateTime.Now;
                feedback.Answer = feedbackDto.Answer;
                feedback.AnsweredBy = await _context.Users.Where(u => u.UUID == userId).FirstOrDefaultAsync();
                _context.Entry(feedback).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return new ResultDto(true, "Answer added succesfully");
            }

            return new ResultDto(false, "Feedback not found");
        }

        public async Task<ActionResult<IEnumerable<DayDto>>> GetAllDays()
        {
            var days = await _context.Days.AsNoTracking()
                .Select(d => new Day { UUID = d.UUID, Name = d.Name, User = d.User})
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync();

            List<DayDto> dayDtos = new List<DayDto>();
            days.ForEach(d => dayDtos.Add(_mapper.Map<DayDto>(d)));

            return dayDtos;
        }

        public async Task<ActionResult<IEnumerable<SharedDay>>> GetAllSharedDays()
        {
            return await _context.SharedDays.AsNoTracking().ToListAsync();
        }

        public ResultDto DeleteMultipleDays(List<string> dayIds)
        {
            dayIds.ForEach(dayId => {
                var day = _context.Days.Where(d => d.UUID == dayId).Include(d => d.Meals).FirstOrDefault();

                if (day != null)
                {
                    day.Meals.ToList().ForEach(m => _context.Meals.Remove(m));
                    _context.Days.Remove(day);
                    _context.SaveChanges();
                }
            });

            return new ResultDto(true, "Days deleted succesfully");
        }

        public ResultDto DeleteMultipleSharedDays(List<string> dayIds)
        {
            dayIds.ForEach(dayId => {
                var day = _context.SharedDays.Where(d => d.UUID == dayId).Include(d => d.Meals).FirstOrDefault();

                if (day != null)
                {
                    day.Meals.ToList().ForEach(m => _context.Meals.Remove(m));
                    _context.SharedDays.Remove(day);
                    _context.SaveChanges();
                }
            });

            return new ResultDto(true, "Days deleted succesfully");
        }

        public async Task<ActionResult<IEnumerable<EditedFood>>> GetAllEditedFoods()
        {
            return await _context.EditedFoods.AsNoTracking().ToListAsync();
        }

        public async Task<ActionResult<IEnumerable<Article>>> GetAllAritcles()
        {
            return await _context.Articles.AsNoTracking().ToListAsync();
        }

        public async Task<ActionResult<IEnumerable<Answer>>> GetAllAnswers()
        {
            return await _context.Answers.AsNoTracking().ToListAsync();
        }

        public async Task<ActionResult<IEnumerable<Question>>> GetAllQuestions()
        {
            return await _context.Questions.AsNoTracking().ToListAsync();
        }

        public async Task<ActionResult<IEnumerable<Comment>>> GetAllComments()
        {
            return await _context.Comments.AsNoTracking().ToListAsync();
        }

        public async Task<ActionResult<IEnumerable<Like>>> GetAllLikes()
        {
            return await _context.Likes.AsNoTracking().ToListAsync();
        }

    }
}
