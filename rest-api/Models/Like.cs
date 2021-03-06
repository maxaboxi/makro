﻿using System;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
namespace Makro.Models
{
    public class Like
    {
        [JsonIgnore]
        public int Id { get; set; }
        [Required]
        public string UUID { get; set; }
        [Required]
        public User User { get; set; }
        [Required]
        public int Value { get; set; }
        public SharedMeal SharedMeal { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
