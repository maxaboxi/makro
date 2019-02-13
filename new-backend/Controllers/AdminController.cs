using Makro.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using Makro.Models;
namespace Makro.Controllers
{
    [Route("api/v2/admin")]
    [ApiController]
    public class AdminController: ControllerBase
    {
        private readonly AdminService _adminService;
        private readonly UserService _userService;
        public AdminController(AdminService adminService, UserService userService)
        {
            _adminService = adminService;
            _userService = userService;
        }


        [HttpGet("allusers")]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
        {
            if (!CheckAuthorization())
            {
                return Unauthorized();
            }

            return await _adminService.GetAllUsers();
        }

        [HttpGet("user/{id}")]
        public async Task<ActionResult<User>> GetUserInformation(string id)
        {
            if (!CheckAuthorization())
            {
                return Unauthorized();
            }

            var user = await _adminService.GetUserInformation(id);

            if (user == null)
            {
                return NotFound("User not found");
            }

            return user;
        }

        private bool CheckAuthorization()
        {
            if (HttpContext.User.Identity.Name == null)
            {
                return false;
            }

            var accessingUser = _userService.GetUser(HttpContext.User.Identity.Name);

            if (accessingUser.Roles.IndexOf("admin") < 0)
            {
                return false;
            }

            return true;
        }
    }
}
