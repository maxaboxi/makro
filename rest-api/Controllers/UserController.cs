using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Makro.Services;
using Makro.DTO;
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
        private readonly AppSettings _appSettings;

        public UserController(UserService userService, IOptions<AppSettings> appSettings)
        {
            _userService = userService;
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
            return await _userService.RegisterUser(userDto, userDto.Password);
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
                    new Claim(ClaimTypes.Name, user.UUID ),
                    new Claim(ClaimTypes.Role, user.Roles?[0] ?? "user")
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);
            var userDto = await _userService.GetUserDto(user.UUID);

            return Ok(new
            {
                Token = tokenString,
                user = userDto.Value
            });
        }

        [AllowAnonymous]
        [HttpPost("forgotpassword")]
        public async Task<ResultDto> ForgotPassword([FromBody]LoginDto login)
        {
            return await _userService.ForgotPassword(login.UsernameOrEmail);
        }

        [AllowAnonymous]
        [HttpPost("resetpassword")]
        public async Task<ResultDto> ResetPassword([FromBody]ResetPasswordDto resetPasswordDto)
        {
            return await _userService.ResetPassword(resetPasswordDto);
        }

        [HttpPost("changepassword")]
        public async Task<ResultDto> ChangePassword(LoginDto credentials)
        {
            return await _userService.ChangePassword(credentials, HttpContext.User.Identity.Name);
        }

        [HttpGet]
        public async Task<ActionResult<UserDto>> GetUserInformation()
        {
            var user = await _userService.GetUserDto(HttpContext.User.Identity.Name);

            if (user == null)
            {
                return NotFound("User not found");
            }

            return user;
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateUserInformation(UserDto userDto)
        {
            if (HttpContext.User.Identity.Name != userDto.UUID)
            {
                return BadRequest();
            }

            return Ok(await _userService.UpdateUserInformation(userDto));
        }

        [HttpPost("delete")]
        public async Task<ResultDto> DeleteAccount(LoginDto credentials)
        {
            return await _userService.DeleteAccount(credentials, HttpContext.User.Identity.Name);
        }

        [HttpGet("admin")]
        public async Task<ResultDto> CheckAdmin()
        {
            return await _userService.CheckAdminRights(HttpContext.User.Identity.Name);
        }

        [HttpPost("targets")]
        public async Task<IActionResult> UpdateUserShowTargets(bool show)
        {
            return Ok(await _userService.UpdateUserShowTargets(HttpContext.User.Identity.Name, show));
        }

        [HttpPost("targets/update")]
        public async Task<IActionResult> UpdateUserTargets([FromBody]UserTargetsDto userTargetsDto)
        {
            return Ok(await _userService.UpdateUserTargets(HttpContext.User.Identity.Name, userTargetsDto));
        }

        [HttpPost("language/{lang}")]
        public async Task<IActionResult> UpdateUserLang(string lang)
        {
            if (lang != "fi" && lang != "en")
            {
                return BadRequest();
            }

            return Ok(await _userService.UpdateUserLang(HttpContext.User.Identity.Name, lang));
        }
    }
}
