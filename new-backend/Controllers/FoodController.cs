using Microsoft.AspNetCore.Mvc;
using Makro.Services;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using Makro.Models;
using System.Collections.Generic;
using Makro.DTO;
using AutoMapper;
namespace Makro.Controllers
{
    [Authorize]
    [Route("api/v2/food")]
    [ApiController]
    public class FoodController : ControllerBase
    {

        private readonly FoodService _foodService;
        private readonly IMapper _mapper;

        public FoodController(FoodService foodService, IMapper mapper)
        {
            _foodService = foodService;
            _mapper = mapper;
        }

        [AllowAnonymous]
        [HttpGet("amount")]
        public async Task<AmountDto> GetAmountOFoods()
        {
            return await _foodService.GetAmountOfFoods();
        }

        [AllowAnonymous]
        [HttpGet("allfoods")]
        public async Task<ActionResult<IEnumerable<FoodDto>>> GetAllFoods()
        {
            return await _foodService.GetAllFoods();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<FoodDto>>> GetAllFoodsByUser(string id)
        {
            return await _foodService.GetAllFoodsByUser(id);
        }

        [HttpPost("addfood")]
        public async Task<IActionResult> AddNewFood(FoodDto foodDto)
        {
            var food = _mapper.Map<Food>(foodDto);
            return Ok(await _foodService.AddNewFood(food, HttpContext.User.Identity.Name));
        }

        [HttpPost("addeditedfood")]
        public async Task<IActionResult> AddNewEditedFood(EditedFood editedFood)
        {
            return Ok(await _foodService.AddNewEditedFood(editedFood));
        }

        [HttpPut("updatefood/{id}")]
        public async Task<IActionResult> UpdateFood(string id, FoodDto foodDto)
        {
            if (HttpContext.User.Identity.Name != foodDto.AddedBy)
            {
                return Unauthorized();
            }

            if (id != foodDto.UUID)
            {
                return BadRequest();
            }

            var food = _mapper.Map<Food>(foodDto);
            return Ok(await _foodService.UpdateFoodInformation(food));
        }

        [HttpDelete("deletefood/{id}")]
        public async Task<IActionResult> DeleteFood(string id)
        {
            return Ok(await _foodService.DeleteFood(id, HttpContext.User.Identity.Name));
        }

    }
}
