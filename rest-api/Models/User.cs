using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
namespace Makro.Models
{
    public class User
    {
        public int Id { get; set; }
        [Required]
        public string UUID { get; set; }
        [Required]
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
        public DateTime LastLogin { get; set; }
        public List<string> Roles { get; set; }
        public bool ShowTargets { get; set; }
        public string Lang { get; set; }
        public List<MealName> MealNames { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

    }
}
