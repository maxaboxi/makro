using Microsoft.AspNetCore.Mvc;
using Makro.Services;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Threading.Tasks;
using Makro.DTO;
using System.Linq;
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
            return await _mealService.GetAllSharedMeals();
        }

        [HttpPost("addsharedmeal")]
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

        [HttpPut("updatesharedmeal/{id}")]
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

        [HttpDelete("deletesharedmeal/{id}")]
        public async Task<IActionResult> DeleteSharedMeal(string id)
        {
            return Ok(await _mealService.DeleteSharedMeal(id, HttpContext.User.Identity.Name));
        }
    }
}
