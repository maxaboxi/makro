using Microsoft.AspNetCore.Mvc;
using Makro.Services;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Threading.Tasks;
using Makro.DTO;
using System.Linq;
using Makro.Dto;
namespace Makro.Controllers
{
    [Authorize]
    [Route("api/v2/meal")]
    public class MealController : ControllerBase
    {
        private readonly MealService _mealService;
        private readonly UserService _userService;

        public MealController(MealService mealService, UserService userService)
        {
            _mealService = mealService;
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SharedMealDto>>> GetAllSharedMeals()
        {
            return await _mealService.GetAllSharedMeals(HttpContext.User.Identity.Name);
        }

        [HttpPost("new")]
        public async Task<IActionResult> AddNewSharedMeal([FromBody]SharedMealDto sharedMealDto)
        {

            if (sharedMealDto.Name == null || sharedMealDto.Foods.ToList().Count == 0)
            {
                return BadRequest();
            }
            var user = _userService.GetUser(HttpContext.User.Identity.Name);

            if (user == null)
            {
                return BadRequest();
            }

            return Ok(await _mealService.AddNewSharedMeal(sharedMealDto, user));
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateSharedMeal(string id, [FromBody]SharedMealDto sharedMealDto)
        {
            if (HttpContext.User.Identity.Name != sharedMealDto.AddedBy)
            {
                return Unauthorized();
            }

            if (sharedMealDto.Name == null || sharedMealDto.AddedBy == null || id != sharedMealDto.UUID)
            {
                return BadRequest();
            }

            return Ok(await _mealService.UpdateSharedMeal(sharedMealDto));
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteSharedMeal(string id)
        {
            return Ok(await _mealService.DeleteSharedMeal(id, HttpContext.User.Identity.Name));
        }

        [HttpPut("updatemealnames/{userid}")]
        public async Task<IActionResult> UpdateMealNames(string userId, [FromBody]List<MealNameDto> mealNames)
        {
            if (HttpContext.User.Identity.Name != userId)
            {
                return Unauthorized();
            }

            var user = _userService.GetUser(userId);

            return Ok(await _mealService.UpdateMealNamesForUser(user, mealNames));
        }
    }
}
