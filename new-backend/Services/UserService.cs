using Makro.Models;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Makro.DTO;
using System.Linq;
using System.Security.Cryptography;
using System;
using Makro.Exceptions;
using AutoMapper;
using Microsoft.Extensions.Logging;
using System.Net;
namespace Makro.Services
{
    public class UserService
    {
        private readonly MakroContext _context;
        private readonly MealService _mealService;
        private readonly IMapper _mapper;
        private readonly ILogger _logger;
        public UserService(MakroContext context, MealService mealService, IMapper mapper, ILogger<UserService> logger)
        {
            _context = context;
            _mealService = mealService;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<ResultDto> RegisterUser(User user, string password)
        {

            if (string.IsNullOrWhiteSpace(password))
            {
                return new ResultDto(false, "Password is required");
            }

            if (_context.Users.Any(u => u.Username == user.Username))
            {
                return new ResultDto(false, "Username is already taken");
            }

            if (_context.Users.Any(u => u.Email == user.Email))
            {
                return new ResultDto(false, "Email is already taken");
            }
            try
            {
                CreatePasswordHash(password, out byte[] passwordHash, out byte[] passwordSalt);
                user.Password = passwordHash;
                user.Salt = passwordSalt;
                _context.Add(user);
                user.Meals = _mealService.GenerateDefaultMeals();
                await _context.SaveChangesAsync();
                return new ResultDto(true, "Registration succesful");
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
            }
            return null;
        }

        public async Task<User> Authenticate(LoginDto login)
        {
            var foundUser = await _context.Users.Where(u => u.Username == login.usernameOrEmail || u.Email == login.usernameOrEmail).FirstOrDefaultAsync();
            if (foundUser != null)
            {
                try
                {
                    if (VerifyPasswordHash(login.password, foundUser.Password, foundUser.Salt))
                    {
                        foundUser.LastLogin = DateTime.Now;
                        await UpdateUserInformation(foundUser);
                        return foundUser;
                    }
                } catch (Exception e)
                {
                    _logger.LogError(e.ToString());
                }

            }
            return null;
        }

        public async Task<ActionResult<UserDto>> GetUserInformation (int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null)
            {
                var userDto = _mapper.Map<UserDto>(user);
                userDto.Meals = _mealService.ConvertToMealDto(await _context.Meals.Where(m => m.User.Id == user.Id).ToListAsync());
                return userDto;
            }

            return null;
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

        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            if (password == null)
            {
                throw new ArgumentNullException(nameof(password));
            }
            if (string.IsNullOrWhiteSpace(password))
            {
                throw new ArgumentException("Value cannot be empty or whitespace only string.", nameof(password));
            }

            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            if (password == null)
            {
                throw new ArgumentNullException(nameof(password));
            }

            if (string.IsNullOrWhiteSpace(password))
            {
                throw new ArgumentException("Value cannot be empty or whitespace only string.", nameof(password));
            }

            if (storedHash.Length != 64)
            {
                throw new ArgumentException("Invalid length of password hash (64 bytes expected).", nameof(storedHash));
            }

            if (storedSalt.Length != 128)
            {
                throw new ArgumentException("Invalid length of password salt (128 bytes expected).", nameof(storedSalt));
            }

            using (var hmac = new HMACSHA512(storedSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != storedHash[i])
                    {
                        return false;
                    }
                }
            }

            return true;
        }

    }
}
