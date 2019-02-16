﻿using Makro.Models;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Makro.DTO;
using System.Linq;
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
                user.Password = HashPassword(password);
                user.Meals = _mealService.GenerateDefaultMealNamesForUser();
                user.UUID = Guid.NewGuid().ToString();
                user.CreatedAt = DateTime.Now;
                user.UpdatedAt = DateTime.Now;
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
                if (ValidatePassword(login.password, foundUser.Password))
                {
                    foundUser.LastLogin = DateTime.Now;
                    await UpdateLastLogin(foundUser);
                    return foundUser;
                }
            }
            return null;
        }

        public async Task<ActionResult<UserDto>> GetUserDto (string id)
        {
            var user = await _context.Users.Include(u => u.Meals).Where(p => p.UUID == id).AsNoTracking().FirstOrDefaultAsync();

            if (user != null)
            {
                user.Password = null;
                user.Meals.Reverse(0, user.Meals.Count);
                return _mapper.Map<UserDto>(user);
            }

            return null;
        }

        public User GetUser(string id)
        {

            return _context.Users.Where(p => p.UUID == id).AsNoTracking().FirstOrDefault();
        }

        public async Task<ResultDto> UpdateUserInformation(UserDto userDto)
        {
            var user = _mapper.Map<User>(userDto);
            var origInfo = _context.Users.Where(u => u.UUID == user.UUID).AsNoTracking().FirstOrDefault();
            user.Id = origInfo.Id;
            user.Password = origInfo.Password;
            user.Roles = origInfo.Roles;
            user.UpdatedAt = DateTime.Now;
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Information updated succesfully");
        }

        public async Task<ResultDto> UpdateUserShowTargets(string id, bool show)
        {
            var user = _context.Users.Where(u => u.UUID == id).FirstOrDefault();
            user.ShowTargets = show;
            user.UpdatedAt = DateTime.Now;
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

        private static string GetRandomSalt()
        {
            return BCrypt.Net.BCrypt.GenerateSalt(12);
        }

        private static string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password, GetRandomSalt());
        }

        private static bool ValidatePassword(string password, string correctHash)
        {
            return BCrypt.Net.BCrypt.Verify(password, correctHash);
        }

        private async Task<int> UpdateLastLogin(User user)
        {
            _context.Entry(user).State = EntityState.Modified;
            return await _context.SaveChangesAsync();
        }
    }
}
