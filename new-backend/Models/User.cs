using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
namespace Makro.Models
{
    public class User
    {
        public int Id { get; set; }
        public string MongoId { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
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
        public DateTime LastLogin { get; set; }
        public List<string> Roles { get; set; }
        public ICollection<Meal> Meals { get; set; }
    }
}
