using AutoMapper;
using Makro.Models;
using Makro.DTO;
namespace Makro.Helpsers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();
        }
    }
}
