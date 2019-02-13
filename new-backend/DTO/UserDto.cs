using System.Collections.Generic;
using Makro.Models;
namespace Makro.DTO
{
    public class UserDto
    {
        public string UUID { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public int Age { get; set; }
        public decimal Height { get; set; }
        public decimal Weight { get; set; }
        public decimal Activity { get; set; }
        public string Sex { get; set; }
        public decimal DailyExpenditure { get; set; }
        public decimal UserAddedExpenditure { get; set; }
        public decimal UserAddedProteinTarget { get; set; }
        public decimal UserAddedCarbTarget { get; set; }
        public decimal UserAddedFatTarget { get; set; }
        public List<MealName> Meals { get; set; }
    }
}
