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

        public MealController(MealService mealService)
        {
            _mealService = mealService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SharedMealDto>>> GetAllSharedMeals()
        {
            return await _mealService.GetAllSharedMeals(HttpContext.User.Identity.Name);
        }

        [HttpGet("user")]
        public async Task<ActionResult<IEnumerable<SharedMealDto>>> GetAllSharedMealsByUser()
        {
            return await _mealService.GetAllSharedMealsByUser(HttpContext.User.Identity.Name);
        }

        [HttpPost("user/meals")]
        public async Task<ResultDto> UpdateMealNamesForUser([FromBody]List<MealNameDto> mealNames)
        {
            return await _mealService.UpdateMealNamesForUser(HttpContext.User.Identity.Name, mealNames);
        }

        [HttpGet("single/{id}")]
        public async Task<ActionResult<SharedMealDto>> GetSingleSharedMeal(string id)
        {
            return await _mealService.GetSingleSharedMeal(id, HttpContext.User.Identity.Name);
        }

        [HttpPost("new")]
        public async Task<IActionResult> AddNewSharedMeal([FromBody]SharedMealDto sharedMealDto)
        {

            if (sharedMealDto.Name == null || sharedMealDto.Foods.ToList().Count == 0)
            {
                return BadRequest();
            }

            return Ok(await _mealService.AddNewSharedMeal(sharedMealDto, HttpContext.User.Identity.Name));
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

        [HttpDelete("delete/multiple")]
        public ResultDto DeleteMultipleDays([FromBody]List<string> mealIds)
        {
            return _mealService.DeleteMultipleSharedMeals(mealIds, HttpContext.User.Identity.Name);
        }

        [HttpPut("updatemealnames/")]
        public async Task<IActionResult> UpdateMealNames([FromBody]List<MealNameDto> mealNames)
        {
            return Ok(await _mealService.UpdateMealNamesForUser(HttpContext.User.Identity.Name, mealNames));
        }
    }
}
