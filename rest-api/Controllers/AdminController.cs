using Makro.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using Makro.Models;
using Microsoft.AspNetCore.Authorization;
using Makro.DTO;
namespace Makro.Controllers
{
    [Route("api/v2/admin")]
    [ApiController]
    [Authorize(Roles = "admin")]
    public class AdminController: ControllerBase
    {
        private readonly AdminService _adminService;
        public AdminController(AdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("user")]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
        {
            return await _adminService.GetAllUsers();
        }

        [HttpGet("user/{id}")]
        public async Task<ActionResult<User>> GetUserInformation(string id)
        {
            var user = await _adminService.GetUserInformation(id);

            if (user == null)
            {
                return NotFound("User not found");
            }

            return user;
        }

        [HttpDelete("user/delete/multiple")]
        public ResultDto DeleteMultipleUsers(List<string> userIds)
        {
            return _adminService.DeleteMultipleUsers(userIds);
        }

        [HttpPost("feedback/answer")]
        public async Task<ResultDto> AnswerToFeedback([FromBody]FeedbackDto feedbackDto)
        {
            return await _adminService.AnswerToFeedback(feedbackDto, HttpContext.User.Identity.Name);
        }

    }
}
