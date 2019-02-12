using Microsoft.AspNetCore.Mvc;
using Makro.Services;
using Microsoft.AspNetCore.Authorization;
using Makro.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
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

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<SharedMeal>>> GetAllSharedMeals()
        {
            return await _mealService.GetAllSharedMeals();
        }

        [HttpPost("addsharedmeal")]
        public async Task<IActionResult> AddNewSharedMeal(SharedMeal sharedMeal)
        {
            return Ok(await _mealService.AddNewSharedMeal(sharedMeal));
        }

        [HttpPut("updatesharedmeal/{id}")]
        public async Task<IActionResult> UpdateSharedMeal(int id, SharedMeal sharedMeal)
        {
            if (id != sharedMeal.Id)
            {
                return BadRequest();
            }

            return Ok(await _mealService.UpdateSharedMeal(sharedMeal));
        }

        [HttpDelete("deletesharedmeal/{id}")]
        public async Task<IActionResult> DeleteSharedMeal(int id)
        {
            return Ok(await _mealService.DeleteSharedMeal(id));
        }
    }
}
