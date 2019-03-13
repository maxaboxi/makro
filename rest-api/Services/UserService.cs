﻿using Makro.DB;
using Makro.Models;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Makro.DTO;
using System.Linq;
using System;
using AutoMapper;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Net.Mail;
using System.Net;
using Makro.Helpers;
using Microsoft.Extensions.Options;

namespace Makro.Services
{
    public class UserService
    {
        private readonly MakroContext _context;
        private readonly MealService _mealService;
        private readonly IMapper _mapper;
        private readonly ILogger _logger;
        private readonly AppSettings _appSettings;
        public UserService(MakroContext context, MealService mealService, IMapper mapper, ILogger<UserService> logger, IOptions<AppSettings> appSettings)
        {
            _context = context;
            _mealService = mealService;
            _mapper = mapper;
            _logger = logger;
            _appSettings = appSettings.Value;
        }

        public async Task<ResultDto> RegisterUser(UserDto userDto, string password)
        {
            var user = _mapper.Map<User>(userDto);

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
                user.MealNames = _mealService.GenerateDefaultMealNamesForUser();
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
            var foundUser = await _context.Users.Where(u => u.Username == login.UsernameOrEmail || u.Email == login.UsernameOrEmail)
            .Include(u => u.MealNames).FirstOrDefaultAsync();
            if (foundUser != null)
            {
                if (ValidatePassword(login.Password, foundUser.Password))
                {
                    foundUser.LastLogin = DateTime.Now;
                    await UpdateLastLogin(foundUser);
                    return foundUser;
                }
            }
            return null;
        }

        public async Task<ResultDto> ChangePassword(LoginDto credentials, string userId)
        {
            var user = await _context.Users
                .Where(u => u.Username == credentials.UsernameOrEmail || u.Email == credentials.UsernameOrEmail)
                .FirstOrDefaultAsync();
                
            if (user != null)
            {
                if (user.UUID != userId)
                {
                    return new ResultDto(false, "Unauthorized");
                }

                if (ValidatePassword(credentials.Password, user.Password))
                {
                    user.UpdatedAt = DateTime.Now;
                    user.Password = HashPassword(credentials.NewPassword);
                    await _context.SaveChangesAsync();
                    return new ResultDto(true, "Password changed succesfully");
                }

            }

            return new ResultDto(false, "Unauthorized");
        }

        public async Task<ResultDto> ForgotPassword(string usernameOrEmail)
        {
            var foundUser = await _context.Users
                .Where(u => u.Email == usernameOrEmail || u.Username == usernameOrEmail)
                .FirstOrDefaultAsync();
      
            if (foundUser != null && foundUser.Email != null)
            {
                foundUser.PasswordResetToken = Guid.NewGuid().ToString();
                _context.Entry(foundUser).State = EntityState.Modified;
                 await _context.SaveChangesAsync();
                var result = SendTokenViaEmail(foundUser.Email, foundUser.PasswordResetToken);

                if (!result)
                {
                    foundUser.PasswordResetToken = null;
                    _context.Entry(foundUser).State = EntityState.Modified;
                    await _context.SaveChangesAsync();
                    return new ResultDto(false, "Unable to sent email");
                }

                return new ResultDto(true, "Password reset token sent to " + foundUser.Email);
            }

            return new ResultDto(false, "Something went wrong");
        }

        public async Task<ResultDto> ResetPassword(ResetPasswordDto resetPasswordDto)
        {
            var foundUser = await _context.Users
                .Where(u => u.Email == resetPasswordDto.Email && u.PasswordResetToken == resetPasswordDto.PasswordResetToken)
                .FirstOrDefaultAsync();

            if (foundUser != null)
            {
                foundUser.PasswordResetToken = null;
                foundUser.Password = HashPassword(resetPasswordDto.Password);
                _context.Entry(foundUser).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return new ResultDto(true, "Password changed succesfully");
            }

            return new ResultDto(false, "Something went wrong");
        }

        public async Task<ActionResult<UserDto>> GetUserDto (string id)
        {
            var user = await _context.Users.Include(u => u.MealNames).Where(p => p.UUID == id).AsNoTracking().FirstOrDefaultAsync();

            if (user != null)
            {
                user.Password = null;
                user.MealNames.Reverse(0, user.MealNames.Count);
                List<MealNameDto> mealNameDtos = new List<MealNameDto>();
                user.MealNames.ForEach(m => mealNameDtos.Add(_mapper.Map<MealNameDto>(m)));
                var userDto = _mapper.Map<UserDto>(user);
                userDto.Meals = mealNameDtos;
                return userDto;
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

        public async Task<ResultDto> CheckAdminRights(string userId)
        {
            var user = await _context.Users.Where(u => u.UUID == userId).FirstOrDefaultAsync();
            if (user.Roles != null && user.Roles.Contains("admin")) {
                return new ResultDto(true, "Ok");
            }

            return new ResultDto(false, "Unauthorized");
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

        public async Task<ResultDto> UpdateUserLang(string id, string lang)
        {
            var user = _context.Users.Where(u => u.UUID == id).FirstOrDefault();
            user.Lang = lang;
            user.UpdatedAt = DateTime.Now;
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return new ResultDto(true, "Information updated succesfully");
        }

        public async Task<ResultDto> DeleteAccount(LoginDto credentials, string userId)
        {
            var user = await _context.Users
                .Where(u => u.Username == credentials.UsernameOrEmail || u.Email == credentials.UsernameOrEmail)
                .FirstOrDefaultAsync();

            if (user != null)
            {
                if (user.UUID != userId)
                {
                    return new ResultDto(false, "Unauthorized");
                }

                if (ValidatePassword(credentials.Password, user.Password))
                {
                    _context.Meals.RemoveRange(_context.Meals.Where(m => m.User == user));
                    _context.MealNames.RemoveRange(_context.MealNames.Where(m => m.User == user));
                    _context.Remove(user);
                    await _context.SaveChangesAsync();
                    return new ResultDto(true, "Account deleted succesfully");
                }

            }

            return new ResultDto(false, "Unauthorized");
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

        private bool SendTokenViaEmail(string email, string resetToken)
        {
            var message = new MailMessage();
            message.To.Add(new MailAddress(email));
            message.From = new MailAddress(_appSettings.Email, "Makro Support");
            message.Subject = "Koodi salasanan nollaamiseen";
            message.Body = "<p>Hei,</p><p>Koodi salasanan nollaamiseen on: " +
                resetToken +
                "</p><p>Osoite: <a href='https://makro.diet/resetpassword'>https://makro.diet/resetpassword<a></p>" +
                "<p>Ystävällisin terveisin,</p><p>Makro Support</p>";
            message.IsBodyHtml = true;

            var client = new SmtpClient(_appSettings.Smtp);
            client.Port = 587;
            client.Credentials = new NetworkCredential(_appSettings.Email, _appSettings.Password);
            client.EnableSsl = true;
            try
            {
                client.Send(message);
                return true;
            } catch (SmtpException)
            {
                return false;
            }
        }
    }
}
