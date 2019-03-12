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
            userIds.ForEach(id =>
            {
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

        public ResultDto DeleteMultipleFeedbacks(List<string> feedbackIds)
        {
            feedbackIds.ForEach(feedbackId =>
            {
                var feedback = _context.Feedbacks.Where(f => f.UUID == feedbackId).FirstOrDefault();

                if (feedback != null)
                {
                    _context.Feedbacks.Remove(feedback);
                    _context.SaveChanges();
                }
            });

            return new ResultDto(true, "Feedbacks deleted succesfully");
        }

        public async Task<ActionResult<IEnumerable<DayDto>>> GetAllDays()
        {
            var days = await _context.Days.AsNoTracking()
                .Select(d => new Day { UUID = d.UUID, Name = d.Name, User = d.User })
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync();

            List<DayDto> dayDtos = new List<DayDto>();
            days.ForEach(d => dayDtos.Add(_mapper.Map<DayDto>(d)));

            return dayDtos;
        }

        public async Task<ActionResult<DayDto>> GetSingleDay(string id)
        {
            var day = await _context.Days.AsNoTracking()
                .Where(d => d.UUID == id)
                .Include(d => d.User)
                .Include(d => d.Meals)
                    .ThenInclude(m => m.MealFoods)
                        .ThenInclude(mf => mf.Food)
                            .ThenInclude(f => f.User)
                .FirstOrDefaultAsync();

            if (day == null)
            {
                return null;
            }

            var dayDto = _mapper.Map<DayDto>(day);

            var mealDtos = new List<MealDto>();

            day.Meals.ToList().ForEach(m =>
            {
                m.User = day.User;
                var mealDto = _mapper.Map<MealDto>(m);
                var foodDtos = new List<FoodDto>();
                m.MealFoods.ToList().ForEach(mf =>
                {
                    var foodDto = _mapper.Map<FoodDto>(mf.Food);
                    foodDto.Amount = mf.FoodAmount;
                    foodDtos.Add(foodDto);
                });
                mealDto.Foods = foodDtos;
                mealDtos.Add(mealDto);
            });

            dayDto.AllMeals = mealDtos;
            return dayDto;
        }

        public async Task<ActionResult<IEnumerable<SharedDay>>> GetAllSharedDays()
        {
            return await _context.SharedDays.AsNoTracking().ToListAsync();
        }

        public ResultDto DeleteMultipleDays(List<string> dayIds)
        {
            dayIds.ForEach(dayId =>
            {
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
            dayIds.ForEach(dayId =>
            {
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

        public ResultDto DeleteMultipleSharedMeals(List<string> mealIds)
        {
            mealIds.ForEach(mealId =>
            {
                var sharedMeal = _context.SharedMeals.Where(sm => sm.UUID == mealId).FirstOrDefault();

                if (sharedMeal != null)
                {
                    _context.SharedMeals.Remove(sharedMeal);
                    _context.SaveChanges();
                }
            });

            return new ResultDto(true, "Meals deleted succesfully");
        }

        public async Task<ActionResult<IEnumerable<FoodDto>>> GetMostRecentFoods()
        {
            var foods = await _context.Foods.AsNoTracking()
                .Include(f => f.User)
                .OrderBy(f => f.CreatedAt)
                .Take(50)
                .ToListAsync();
            List<FoodDto> foodDtos = new List<FoodDto>();
            foods.ForEach(f => foodDtos.Add(_mapper.Map<FoodDto>(f)));
            foodDtos.Reverse(0, foodDtos.Count);
            return foodDtos;
        }

        public ResultDto DeleteMultipleFoods(List<string> foodIds)
        {
            foodIds.ForEach(foodId =>
            {
                var food = _context.Foods.Include(f => f.User).Where(f => f.UUID == foodId).FirstOrDefault();

                if (food != null)
                {
                    _context.Foods.Remove(food);
                    _context.SaveChanges();
                }

            });

            return new ResultDto(true, "Foods deleted succesfully");
        }

        public async Task<ActionResult<IEnumerable<EditedFood>>> GetAllEditedFoods()
        {
            return await _context.EditedFoods.AsNoTracking().ToListAsync();
        }

        public ResultDto DeleteMultipleQuestions(List<string> questionIds)
        {
            questionIds.ForEach(questionId =>
            {
                var question = _context.Questions.Where(q => q.UUID == questionId).FirstOrDefault();

                if (question != null)
                {
                    _context.Questions.Remove(question);
                    _context.SaveChanges();
                }
            });

            return new ResultDto(true, "Questions deleted succesfully");
        }

        public async Task<ActionResult<IEnumerable<AnswerDto>>> GetAllAnswers()
        {
            var answers = await _context.Answers.AsNoTracking()
                .Include(a => a.User)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
            List<AnswerDto> answerDtos = new List<AnswerDto>();
            answers.ForEach(a => answerDtos.Add(_mapper.Map<AnswerDto>(a)));
            return answerDtos;
        }

        public ResultDto DeleteMultipleAnswers(List<string> answerIds)
        {
            answerIds.ForEach(answerId =>
            {
                var answer = _context.Answers.Where(a => a.UUID == answerId).FirstOrDefault();

                if (answer != null)
                {
                    _context.Answers.Remove(answer);
                    _context.SaveChanges();
                }
            });

            return new ResultDto(true, "Answers deleted succesfully");
        }

        public async Task<ActionResult<IEnumerable<CommentDto>>> GetAllComments()
        {
            var comments = await _context.Comments.AsNoTracking()
                .Include(c => c.User)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
            List<CommentDto> commentDtos = new List<CommentDto>();
            comments.ForEach(c => commentDtos.Add(_mapper.Map<CommentDto>(c)));
            return commentDtos;
        }

        public ResultDto DeleteMultipleComments(List<string> commentIds)
        {
            commentIds.ForEach(commentId =>
            {
                var comment = _context.Comments.Where(c => c.UUID == commentId).FirstOrDefault();

                if (comment != null)
                {
                    _context.Comments.Remove(comment);
                    _context.SaveChanges();
                }
            });

            return new ResultDto(true, "Comments deleted succesfully");
        }

        public ResultDto DeleteMultipleArticles(List<string> articleIds)
        {
            articleIds.ForEach(articleId =>
            {
                var article = _context.Articles.Where(a => a.UUID == articleId).FirstOrDefault();

                if (article != null)
                {
                    _context.Articles.Remove(article);
                    _context.SaveChanges();
                }

            });
            return new ResultDto(true, "Articles deleted succesfully");
        }

        public async Task<ActionResult<IEnumerable<LikeDto>>> GetAllLikes()
        {
            var likes = await _context.Likes.AsNoTracking()
                .Include(l => l.User)
                .Include(l => l.Answer)
                .Include(l => l.Article)
                .Include(l => l.Comment)
                .Include(l => l.SharedMeal)
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync();
            List<LikeDto> likeDtos = new List<LikeDto>();
            likes.ForEach(l =>
            {
                var likeDto = _mapper.Map<LikeDto>(l);
                likeDto.LikedContent = l.Article?.Title ?? l.Answer?.AnswerBody ?? l.Comment?.Body ?? l.SharedMeal?.Name;
                likeDtos.Add(likeDto);
            });

            return likeDtos;
        }

        public ResultDto DeleteMultipleLikes(List<string> likeIds)
        {
            likeIds.ForEach(likeId =>
            {
                var like = _context.Likes.Where(l => l.UUID == likeId).FirstOrDefault();

                if (like != null)
                {
                    _context.Likes.Remove(like);
                    _context.SaveChanges();
                }

            });
            return new ResultDto(true, "Likes deleted succesfully");
        }

    }
}
