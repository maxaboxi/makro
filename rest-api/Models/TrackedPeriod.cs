using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace Makro.Models
{
    public class TrackedPeriod
    {
        [JsonIgnore]
        public int Id { get; set; }
        [Required]
        public string UUID { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public User User { get; set; }
        [Required]
        public ICollection<Day> Days { get; set; }
        [Required]
        public decimal TotalCalories { get; set; }
        [Required]
        public decimal AverageCaloriesPerDay { get; set; }
        [Required]
        public decimal SmallestCalorieCount { get; set; }
        [Required]
        public decimal BiggestCalorieCount { get; set; }
        [Required]
        public decimal TotalProtein { get; set; }
        [Required]
        public decimal TotalCarbs { get; set; }
        [Required]
        public decimal TotalFat { get; set; }
        [Required]
        public decimal TotalFiber { get; set; }
        [Required]
        public decimal TotalSugar { get; set; }
        [Required]
        public decimal TotalFoodWeight { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
