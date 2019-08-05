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
        public async Task<ActionResult<IEnumerable<User>>> GetMostRecentUsers()
        {
            return await _adminService.GetMostRecentUsers();
        }

        [HttpGet("user/all")]
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

        [HttpDelete("feedback/delete/multiple")]
        public ResultDto DeleteMultipleFeedbacks(List<string> feedbackIds)
        {
            return _adminService.DeleteMultipleFeedbacks(feedbackIds);
        }

        [HttpGet("day")]
        public async Task<ActionResult<IEnumerable<DayDto>>> GetMostRecentDays()
        {
            return await _adminService.GetMostRecentDays();
        }

        [HttpGet("day/all")]
        public async Task<ActionResult<IEnumerable<DayDto>>> GetAllDays()
        {
            return await _adminService.GetAllDays();
        }

        [HttpGet("day/{id}")]
        public async Task<ActionResult<DayDto>> GetSingleDay(string id)
        {
            return await _adminService.GetSingleDay(id);
        }

        [HttpGet("day/shared")]
        public async Task<ActionResult<IEnumerable<SharedDay>>> GetMostRecentSharedDays()
        {
            return await _adminService.GetMostRecentSharedDays();
        }

        [HttpGet("day/shared/all")]
        public async Task<ActionResult<IEnumerable<SharedDay>>> GetAllSharedDays()
        {
            return await _adminService.GetAllSharedDays();
        }

        [HttpDelete("day/delete/multiple")]
        public ResultDto DeleteMultipleDays(List<string> dayIds)
        {
            return _adminService.DeleteMultipleDays(dayIds);
        }

        [HttpDelete("day/shared/delete/multiple")]
        public ResultDto DeleteMultipleSharedDays(List<string> dayIds)
        {
            return _adminService.DeleteMultipleSharedDays(dayIds);
        }

        [HttpDelete("meal/shared/delete/multiple")]
        public ResultDto DeleteMultipleSharedMeals(List<string> mealIds)
        {
            return _adminService.DeleteMultipleSharedMeals(mealIds);
        }

        [HttpGet("food")]
        public async Task<ActionResult<IEnumerable<FoodDto>>> GetMostRecentFoods()
        {
            return await _adminService.GetMostRecentFoods();
        }

        [HttpGet("food/all")]
        public async Task<ActionResult<IEnumerable<FoodDto>>> GetAllFoods()
        {
            return await _adminService.GetAllFoods();
        }

        [HttpDelete("food/delete/multiple")]
        public ResultDto DeleteMultipleFoods(List<string> foodIds)
        {
            return _adminService.DeleteMultipleFoods(foodIds);
        }

        [HttpGet("like")]
        public async Task<ActionResult<IEnumerable<LikeDto>>> GetAllLikes()
        {
            return await _adminService.GetAllLikes();
        }

        [HttpDelete("like/delete/multiple")]
        public ResultDto DeleteMultipleLikes(List<string> likeIds)
        {
            return _adminService.DeleteMultipleLikes(likeIds);
        }

        [HttpGet("trackedperiod")]
        public async Task<ActionResult<IEnumerable<TrackedPeriodDto>>> GetAllTrackedPeriods()
        {
            return await _adminService.GetAllTrackedPeriods();
        }

        [HttpGet("trackedperiod/{id}")]
        public async Task<ActionResult<TrackedPeriodDto>> GetSingleTrackedPeriod(string id)
        {
            return await _adminService.GetSingleTrackedPeriod(id);
        }

        [HttpDelete("trackedperiod/delete/multiple")]
        public ResultDto DeleteMultipleTrackedPeriod(List<string> trackedPeriodIds)
        {
            return _adminService.DeleteMultipleTrackedPeriod(trackedPeriodIds);
        }

        [HttpGet("meal/all")]
        public async Task<ActionResult<IEnumerable<SharedMealDto>>> GetAllCreatedMeals()
        {
            return await _adminService.GetAllCreatedMeals();
        }
    }
}
