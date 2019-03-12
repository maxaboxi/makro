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

        [HttpDelete("feedback/delete/multiple")]
        public ResultDto DeleteMultipleFeedbacks(List<string> feedbackIds)
        {
            return _adminService.DeleteMultipleFeedbacks(feedbackIds);
        }

        [HttpGet("day")]
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

        [HttpDelete("food/delete/multiple")]
        public ResultDto DeleteMultipleFoods(List<string> foodIds)
        {
            return _adminService.DeleteMultipleFoods(foodIds);
        }

        [HttpGet("food/edited")]
        public async Task<ActionResult<IEnumerable<EditedFood>>> GetAllEditedFoods()
        {
            return await _adminService.GetAllEditedFoods();
        }

        [HttpDelete("question/delete/multiple")]
        public ResultDto DeleteMultiplQuestions(List<string> questionIds)
        {
            return _adminService.DeleteMultipleQuestions(questionIds);
        }

        [HttpGet("answer")]
        public async Task<ActionResult<IEnumerable<AnswerDto>>> GetAllAnswers()
        {
            return await _adminService.GetAllAnswers();
        }

        [HttpDelete("answer/delete/multiple")]
        public ResultDto DeleteMultiplAnswers(List<string> answerIds)
        {
            return _adminService.DeleteMultipleAnswers(answerIds);
        }

        [HttpGet("comment")]
        public async Task<ActionResult<IEnumerable<CommentDto>>> GetAllComments()
        {
            return await _adminService.GetAllComments();
        }

        [HttpDelete("comment/delete/multiple")]
        public ResultDto DeleteMultipleComments(List<string> commentIds)
        {
            return _adminService.DeleteMultipleComments(commentIds);
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
    }
}
