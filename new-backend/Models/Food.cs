﻿using System;
using System.ComponentModel.DataAnnotations;
namespace Makro.Models
{
    public class Food
    {
        public int Id { get; set; }
        public string MongoId { get; set; }
        [Required]
        public User User { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public decimal Energy { get; set; }
        [Required]
        public decimal Protein { get; set; }
        [Required]
        public decimal Carbs { get; set; }
        public decimal Sugar { get; set; }
        public decimal Fiber { get; set; }
        public decimal PackageSize { get; set; }
        public decimal ServingSize { get; set; }
        public string Username { get; set; }
        public string En { get; set; }
        public Boolean WaitingForApproval { get; set; }

    }
}
