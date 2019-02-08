using Makro.Models;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Makro.DTO;
using System.Linq;
using System.Security.Cryptography;
using System;
using Makro.Exceptions;
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

        public async Task<int> RegisterUser(User user, string password)
        {
            if (string.IsNullOrWhiteSpace(password))
                throw new AppException("Password is required");

            if (_context.Users.Any(u => u.Username == user.Username))
                throw new AppException("Username \"" + user.Username + "\" is already taken");

            if (_context.Users.Any(u => u.Email == user.Email))
                throw new AppException("Email \"" + user.Email + "\" is already taken");

            CreatePasswordHash(password, out byte[] passwordHash, out byte[] passwordSalt);
            user.Password = passwordHash;
            user.Salt = passwordSalt;
            _context.Add(user);
            user.Meals = _mealService.GenerateDefaultMeals();
            return await _context.SaveChangesAsync();
        }

        public async Task<User> Authenticate(LoginDto login)
        {
            var foundUser = await _context.Users.Where(u => u.Username == login.usernameOrEmail || u.Email == login.usernameOrEmail).FirstOrDefaultAsync();
            if (foundUser != null)
            {
                if (VerifyPasswordHash(login.password, foundUser.Password, foundUser.Salt))
                {
                    foundUser.LastLogin = DateTime.Now;
                    await UpdateUserInformation(foundUser);
                    return foundUser;
                }
            }
            return null;
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

        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            if (password == null) throw new ArgumentNullException(nameof(password));
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", nameof(password));

            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", nameof(password));
            if (storedHash.Length != 64) throw new ArgumentException("Invalid length of password hash (64 bytes expected).", "passwordHash");
            if (storedSalt.Length != 128) throw new ArgumentException("Invalid length of password salt (128 bytes expected).", "passwordHash");

            using (var hmac = new HMACSHA512(storedSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != storedHash[i]) return false;
                }
            }
            
            return true;
        }



    }
}
