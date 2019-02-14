using AutoMapper;
using Makro.Models;
using Makro.DTO;
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
        }
    }
}
