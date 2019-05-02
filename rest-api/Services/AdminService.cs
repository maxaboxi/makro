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

        public async Task<ActionResult<IEnumerable<User>>> GetMostRecentUsers()
        {
            return await _context.Users.AsNoTracking()
                .Select(u => new User { UUID = u.UUID, Username = u.Username, LastLogin = u.LastLogin })
                .OrderByDescending(u => u.LastLogin)
                .Take(50)
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
                .Select(d => new Day { UUID = d.UUID, Name = d.Name, User = d.User, CreatedAt = d.CreatedAt })
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync();

            List<DayDto> dayDtos = new List<DayDto>();
            days.ForEach(d => dayDtos.Add(_mapper.Map<DayDto>(d)));

            return dayDtos;
        }

        public async Task<ActionResult<IEnumerable<DayDto>>> GetMostRecentDays()
        {
            var days = await _context.Days.AsNoTracking()
                .Select(d => new Day { UUID = d.UUID, Name = d.Name, User = d.User, CreatedAt = d.CreatedAt })
                .OrderByDescending(d => d.CreatedAt)
                .Take(50)
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
                    foodDto.Energy = foodDto.Energy * (foodDto.Amount / 100);
                    foodDto.Protein = foodDto.Protein * (foodDto.Amount / 100);
                    foodDto.Carbs = foodDto.Carbs * (foodDto.Amount / 100);
                    foodDto.Fat = foodDto.Fat * (foodDto.Amount / 100);
                    foodDto.Sugar = foodDto.Sugar * (foodDto.Amount / 100);
                    foodDto.Fiber = foodDto.Fiber * (foodDto.Amount / 100);
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

        public async Task<ActionResult<IEnumerable<FoodDto>>> GetAllFoods()
        {
            var foods = await _context.Foods.AsNoTracking()
                .Include(f => f.User)
                .OrderBy(f => f.CreatedAt)
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

        public async Task<ActionResult<IEnumerable<LikeDto>>> GetAllLikes()
        {
            var likes = await _context.Likes.AsNoTracking()
                .Include(l => l.User)
                .Include(l => l.SharedMeal)
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync();
            List<LikeDto> likeDtos = new List<LikeDto>();
            likes.ForEach(l =>
            {
                var likeDto = _mapper.Map<LikeDto>(l);
                likeDto.LikedContent = l.SharedMeal?.Name;
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
