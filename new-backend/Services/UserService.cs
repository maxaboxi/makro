using Makro.Models;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Makro.DTO;
using System.Linq;
using System.Security.Cryptography;
using System;
using AutoMapper;
using Microsoft.Extensions.Logging;
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
                user.Meals = _mealService.GenerateDefaultMealNamesForUser();
                user.UUID = Guid.NewGuid().ToString();
                _context.Add(user);
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

        public async Task<ActionResult<UserDto>> GetUserInformation (string id)
        {
            var user = await _context.Users.Include(u => u.Meals).Where(p => p.UUID == id).FirstOrDefaultAsync();

            if (user != null)
            {
                user.Password = null;
                return _mapper.Map<UserDto>(user);
            }

            return null;
        }

        public User GetUserInformationObjectIdForAuthorization(string id)
        {

            return _context.Users.Where(p => p.UUID == id).FirstOrDefault();
        }

        public async Task<ResultDto> UpdateUserInformation(User user)
        {
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Information updated succesfully");

        }

        public async Task<ResultDto> DeleteAccount(string id)
        {
            var user = await _context.Users.Where(u => u.UUID == id).FirstOrDefaultAsync();

            if (user == null)
            {
                return new ResultDto(false, "User not found");
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return new ResultDto(true, "User deleted succesfully");
        }

        public async Task<AmountDto> GetAmountOfUsers()
        {
            return new AmountDto(await _context.Users.CountAsync());
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
