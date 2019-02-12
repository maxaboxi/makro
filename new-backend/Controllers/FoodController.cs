using Microsoft.AspNetCore.Mvc;
using Makro.Services;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using Makro.Models;
using System.Collections.Generic;
using Makro.DTO;
namespace Makro.Controllers
{
    [Authorize]
    [Route("api/v2/food")]
    [ApiController]
    public class FoodController : ControllerBase
    {

        private readonly FoodService _foodService;

        public FoodController(FoodService foodService)
        {
            _foodService = foodService;
        }

        [AllowAnonymous]
        [HttpGet("amount")]
        public async Task<AmountDto> GetAmountOFoods()
        {
            return await _foodService.GetAmountOfFoods();
        }

        [AllowAnonymous]
        [HttpGet("allfoods")]
        public async Task<ActionResult<IEnumerable<Food>>> GetAllFoods()
        {
            return await _foodService.GetAllFoods();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<Food>>> GetAllFoodsByUser(string id)
        {
            return await _foodService.GetAllFoodsByUser(id);
        }

        [HttpPost("addfood")]
        public async Task<IActionResult> AddNewFood(Food food)
        {
            return Ok(await _foodService.AddNewFood(food));
        }

        [HttpPost("addeditedfood")]
        public async Task<IActionResult> AddNewEditedFood(EditedFood editedFood)
        {
            return Ok(await _foodService.AddNewEditedFood(editedFood));
        }

        [HttpPut("updatefood/{id}")]
        public async Task<IActionResult> UpdateFood(int id, Food food)
        {
            if (id != food.Id)
            {
                return BadRequest();
            }

            return Ok(await _foodService.UpdateFoodInformation(food));
        }

        [HttpDelete("deletefood/{id}")]
        public async Task<IActionResult> DeleteFood(int id)
        {
            return Ok(await _foodService.DeleteFood(id));
        }

    }
}
