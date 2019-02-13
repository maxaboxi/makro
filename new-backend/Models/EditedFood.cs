﻿using System.ComponentModel.DataAnnotations;
using System;
using Newtonsoft.Json;
namespace Makro.Models
{
    public class EditedFood
    {
        [JsonIgnore]
        public int Id { get; set; }
        [Required]
        public string UUID { get; set; }
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
        [Required]
        public decimal Fat { get; set; }
        public decimal Sugar { get; set; }
        public decimal Fiber { get; set; }
        public decimal PackageSize { get; set; }
        public decimal ServingSize { get; set; }
        public string En { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        [Required]
        public bool WaitingForApproval { get; set; }
        [Required]
        public string ReasonForEditing { get; set; }
        [Required]
        public User EditedBy { get; set; }
        public string EnglishTranslation { get; set; }
    }
}
