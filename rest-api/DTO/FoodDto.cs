﻿using System;
using System.ComponentModel.DataAnnotations;
namespace Makro.DTO
{
    public class FoodDto
    {
        [Required]
        public string Name { get; set; }
        public string UUID { get; set; }
        public string AddedBy { get; set; }
        public string AddedByUsername { get; set; }
        [Required]
        public decimal Energy { get; set; }
        [Required]
        public decimal Protein { get; set; }
        [Required]
        public decimal Carbs { get; set; }
        [Required]
        public decimal Fat { get; set; }
        public decimal Sugar { get; set; }
        public decimal Fiber { get; set; }
        public decimal PackageSize { get; set; }
        public decimal ServingSize { get; set; }
        public string En { get; set; }
        public decimal Amount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
