using AutoMapper;
using Makro.Models;
using Makro.DTO;
using System;
using Makro.Dto;
using System.Collections.Generic;
namespace Makro.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();
            CreateMap<Food, FoodDto>().AfterMap((src, dest) => dest.AddedBy = src.User.UUID);
            CreateMap<FoodDto, Food>();
            CreateMap<Day, DayDto>().AfterMap((src, dest) => dest.UserId = src.User.UUID);
            CreateMap<DayDto, Day>();
            CreateMap<SharedMeal, SharedMealDto>().AfterMap((src, dest) => {
                dest.AddedBy = src.User.UUID;
                dest.AddedByName = src.User.Username;
            });
            CreateMap<SharedMealDto, SharedMeal>();
            CreateMap<Meal, MealDto>().AfterMap((src, dest) => dest.UserId = src.User.UUID);
            CreateMap<MealDto, Meal>().AfterMap((src, dest) => dest.UUID = Guid.NewGuid().ToString());
            CreateMap<MealName, MealNameDto>().AfterMap((src, dest) => dest.Foods = new List<FoodDto>());
            CreateMap<MealNameDto, MealName>();
            CreateMap<Question, QuestionDto>().AfterMap((src, dest) => {
                dest.UserId = src.User.UUID;
                dest.Username = src.User.Username;
            });
            CreateMap<QuestionDto, Question>();
            CreateMap<Answer, AnswerDto>().AfterMap((src, dest) => {
                dest.UserId = src.User.UUID;
                dest.Username = src.User.Username;
            });
            CreateMap<AnswerDto, Answer>();
            CreateMap<Comment, CommentDto>().AfterMap((src, dest) => {
                dest.UserId = src.User.UUID;
                dest.Username = src.User.Username;
            });
            CreateMap<CommentDto, Comment>();
            CreateMap<Like, LikeDto>().AfterMap((src, dest) => dest.UserUUID = src.User.UUID);
            CreateMap<LikeDto, Like>();
        }
    }
}
