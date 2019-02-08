using Microsoft.AspNetCore.Mvc;
using Makro.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using Makro.Services;
using Makro.DTO;
using AutoMapper;
namespace Makro.Controllers
{
    [Route("api/v2/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly IMapper _mapper;
        public UserController(UserService userService, IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> RegisterUser(UserDto userDto)
        {
            var user = _mapper.Map<User>(userDto);
            var result = await _userService.RegisterUser(user, userDto.Password);

            return CreatedAtAction(nameof(_userService.GetUser), new { id = user.Id }, user);
        }

        [HttpPost("login")]
        public async Task<ActionResult<bool>> LoginUser(LoginDto login)
        {
            return await _userService.LoginUser(login);
        }

        [HttpGet("allusers")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers() {
            return await _userService.GetUsers();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUserInformation(int id)
        {
            var user = await _userService.GetUserDto(id);

            if (user == null)
            {
                return NotFound();
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

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAccount(int id)
        {
            await _userService.DeleteAccount(id);

            return NoContent();
        }
    }
}
