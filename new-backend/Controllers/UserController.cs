using Microsoft.AspNetCore.Mvc;
using Makro.Models;
using System.Threading.Tasks;
using Makro.Services;
using Makro.DTO;
using AutoMapper;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Makro.Helpers;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
namespace Makro.Controllers
{
    [Route("api/v2/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly IMapper _mapper;
        private readonly AppSettings _appSettings;

        public UserController(UserService userService, IMapper mapper, IOptions<AppSettings> appSettings)
        {
            _userService = userService;
            _mapper = mapper;
            _appSettings = appSettings.Value;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ResultDto> RegisterUser(UserDto userDto)
        {
            var user = _mapper.Map<User>(userDto);
            return await _userService.RegisterUser(user, userDto.Password);
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate(LoginDto login)
        {
            var user = await _userService.Authenticate(login);

            if (user == null)
            {
                return BadRequest(new { message = "Username or password is incorrect" });
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.ObjectId ??user.Id.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new
            {
                Id = user.ObjectId,
                user.Username,
                Token = tokenString
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUserInformation(int id)
        {
            var user = await _userService.GetUserInformation(id);

            if (user == null)
            {
                return NotFound("User not found");
            }

            return user;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUserInformation(int id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            var result = await _userService.UpdateUserInformation(user);

            return Ok(new ResultDto(true, "Information updated"));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAccount(int id)
        {
            await _userService.DeleteAccount(id);

            return Ok(new ResultDto(true, "Account deleted"));
        }
    }
}
