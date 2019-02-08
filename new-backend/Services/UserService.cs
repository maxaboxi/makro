using Makro.Models;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Makro.DTO;
using System.Linq;
namespace Makro.Services
{
    public class UserService
    {
        private readonly MakroContext _context;
        private readonly MealService _mealService;
        public UserService(MakroContext context, MealService mealService)
        {
            _context = context;
            _mealService = mealService;
        }

        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {

            return await _context.Users.ToListAsync();
        }

        public async Task<ActionResult<User>> GetUser (int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return null;
            }

            return user;
        }

        public Task<UserDto> GetUserDto(int id)
        {
            return ConvertToUserDto(id);
        }

        public async Task<int> RegisterUser(User user)
        {
            _context.Add(user);
            user.Meals = _mealService.GenerateDefaultMeals();
            return await _context.SaveChangesAsync();
        }

        public async Task<int> UpdateUserInformation(User user)
        {
            _context.Entry(user).State = EntityState.Modified;
            return await _context.SaveChangesAsync();

       }

        public async Task<bool> DeleteAccount(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return false;
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<UserDto> ConvertToUserDto(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return null;
            }
            var meals = await _context.Meals.Where(m => m.User.Id == user.Id).ToListAsync();
            var mealDtos = _mealService.ConvertToMealDto(meals);

            var userDto = new UserDto
            {
                MongoId = user.MongoId,
                Username = user.Username,
                Email = user.Email,
                Age = user.Age,
                Height = user.Height,
                Weight = user.Weight,
                Activity = user.Activity,
                Sex = user.Sex,
                DailyExpenditure = user.DailyExpenditure,
                UserAddedExpenditure = user.UserAddedExpenditure,
                UserAddedProteinTarget = user.UserAddedProteinTarget,
                UserAddedCarbTarget = user.UserAddedCarbTarget,
                UserAddedFatTarget = user.UserAddedFatTarget,
                Roles = user.Roles,
                Meals = mealDtos
            };

            return userDto;
        }



    }
}
