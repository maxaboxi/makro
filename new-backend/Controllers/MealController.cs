using Microsoft.AspNetCore.Mvc;
using Makro.Services;
using Microsoft.AspNetCore.Authorization;
using Makro.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Makro.DTO;
using AutoMapper;
using System;
using System.Linq;
namespace Makro.Controllers
{
    [Authorize]
    [Route("api/v2/meal")]
    public class MealController : ControllerBase
    {
        private readonly MealService _mealService;
        private readonly IMapper _mapper;
        private readonly UserService _userService;

        public MealController(MealService mealService, IMapper mapper, UserService userService)
        {
            _mealService = mealService;
            _mapper = mapper;
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
        public async Task<IActionResult> UpdateSharedMeal(string id, SharedMealDto sharedMealDto)
        {
            if (HttpContext.User.Identity.Name != sharedMealDto.AddedBy)
            {
                return Unauthorized();
            }

            if (sharedMealDto.Name == null || sharedMealDto.AddedBy == null || id != sharedMealDto.UUID)
            {
                return BadRequest();
            }

            var sharedMeal = _mapper.Map<SharedMeal>(sharedMealDto);

            return Ok(await _mealService.UpdateSharedMeal(sharedMeal));
        }

        [HttpDelete("deletesharedmeal/{id}")]
        public async Task<IActionResult> DeleteSharedMeal(string id)
        {
            return Ok(await _mealService.DeleteSharedMeal(id, HttpContext.User.Identity.Name));
        }
    }
}
