using System;
using System.Collections.Generic;

namespace Makro.DTO
{
    public class TrackedPeriodDto
    {
        public string UUID { get; set; }
        public string Name { get; set; }
        public string UserId { get; set; }
        public string Username { get; set; }
        public List<DayDto> Days { get; set; }
        public decimal TotalCalories { get; set; }
        public decimal AverageCaloriesPerDay { get; set; }
        public decimal SmallestCalorieCount { get; set; }
        public decimal BiggestCalorieCount { get; set; }
        public decimal TotalProtein { get; set; }
        public decimal TotalCarbs { get; set; }
        public decimal TotalFat { get; set; }
        public decimal TotalFiber { get; set; }
        public decimal TotalSugar { get; set; }
        public decimal TotalFoodWeight { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
