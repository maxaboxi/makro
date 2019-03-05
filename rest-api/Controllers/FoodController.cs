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
        private readonly UserService _userService;

        public FoodController(FoodService foodService, UserService userService)
        {
            _foodService = foodService;
            _userService = userService;
        }

        [AllowAnonymous]
        [HttpGet("amount")]
        public async Task<AmountDto> GetAmountOFoods()
        {
            return await _foodService.GetAmountOfFoods();
        }

        [AllowAnonymous]
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<FoodDto>>> GetAllFoods()
        {
            return await _foodService.GetAllFoods();
        }

        [HttpGet("exclude")]
        public async Task<ActionResult<IEnumerable<FoodDto>>> GetAllFoodsExcludeOtherUsers()
        {
            return await _foodService.GetAllFoodsExcludeOtherUsers(HttpContext.User.Identity.Name);
        }

        [HttpGet("user")]
        public async Task<ActionResult<IEnumerable<FoodDto>>> GetAllFoodsByUser()
        {
            return await _foodService.GetAllFoodsByUser(HttpContext.User.Identity.Name);
        }

        [HttpPost("new")]
        public async Task<IActionResult> AddNewFood(FoodDto foodDto)
        {
            return Ok(await _foodService.AddNewFood(foodDto, HttpContext.User.Identity.Name));
        }

        [HttpPost("newedited")]
        public async Task<IActionResult> AddNewEditedFood(EditedFood editedFood)
        {
            return Ok(await _foodService.AddNewEditedFood(editedFood));
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateFood(string id, [FromBody]FoodDto foodDto)
        {
            if (HttpContext.User.Identity.Name != foodDto.AddedBy)
            {
                return Unauthorized();
            }

            if (id != foodDto.UUID)
            {
                return BadRequest();
            }

            return Ok(await _foodService.UpdateFoodInformation(foodDto));
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteFood(string id)
        {
            return Ok(await _foodService.DeleteFood(id, HttpContext.User.Identity.Name));
        }

    }
}
