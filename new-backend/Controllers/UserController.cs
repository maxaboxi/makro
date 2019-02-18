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
    [Authorize]
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
        [HttpGet("amount")]
        public async Task<AmountDto> GetAmountOfUsers()
        {
            return await _userService.GetAmountOfUsers();
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

            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.UUID )
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new
            {
                Id = user.UUID,
                user.Username,
                Token = tokenString
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUserInformation(string id)
        {
            var user = await _userService.GetUserDto(id);

            if (HttpContext.User.Identity.Name != id)
            {
                return Unauthorized();
            }

            if (user == null)
            {
                return NotFound("User not found");
            }

            return user;
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateUserInformation(string id, UserDto userDto)
        {
            if (HttpContext.User.Identity.Name != id)
            {
                return Unauthorized();
            }

            if (id != userDto.UUID)
            {
                return BadRequest();
            }

            return Ok(await _userService.UpdateUserInformation(userDto));
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteAccount(string id)
        {
            if (HttpContext.User.Identity.Name != id)
            {
                return Unauthorized();
            }

            await _userService.DeleteAccount(id);

            return Ok(new ResultDto(true, "Account deleted"));
        }
    }
}
