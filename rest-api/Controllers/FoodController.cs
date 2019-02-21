using Microsoft.AspNetCore.Mvc;
using Makro.Services;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using Makro.Models;
using System.Collections.Generic;
using Makro.DTO;
using AutoMapper;
using System;
namespace Makro.Controllers
{
    [Authorize]
    [Route("api/v2/food")]
    [ApiController]
    public class FoodController : ControllerBase
    {

        private readonly FoodService _foodService;
        private readonly IMapper _mapper;
        private readonly UserService _userService;

        public FoodController(FoodService foodService, IMapper mapper, UserService userService)
        {
            _foodService = foodService;
            _mapper = mapper;
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
            var user = _userService.GetUser(HttpContext.User.Identity.Name);

            if (user == null)
            {
                return Ok( new ResultDto(false, "Unauthorized"));
            }

            var food = _mapper.Map<Food>(foodDto);
            return Ok(await _foodService.AddNewFood(food, user));
        }

        [HttpPost("newedited")]
        public async Task<IActionResult> AddNewEditedFood(EditedFood editedFood)
        {
            return Ok(await _foodService.AddNewEditedFood(editedFood));
        }

        [HttpPut("update/{id}")]
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

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteFood(string id)
        {
            return Ok(await _foodService.DeleteFood(id, HttpContext.User.Identity.Name));
        }

    }
}
