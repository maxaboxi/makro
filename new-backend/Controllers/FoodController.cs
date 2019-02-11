using Microsoft.AspNetCore.Mvc;
using Makro.Services;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using Makro.Models;
using System.Collections.Generic;
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

    }
}
