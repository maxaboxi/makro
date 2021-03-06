﻿using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using Newtonsoft.Json;
namespace Makro.Models
{
    public class SharedMeal
    {
        [JsonIgnore]
        public int Id { get; set; }
        [Required]
        public string UUID { get; set; }
        [Required]
        public User User { get; set; }
        [Required]
        public string Name { get; set; }
        public string Info { get; set; }
        public string Recipe { get; set; }
        [Required]
        public List<string> Tags { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public ICollection<SharedMealFood> SharedMealFoods { get; set; }
        [Required]
        public bool Shared { get; set; }
        public int PortionSize { get; set; }
        public int Portions { get; set; }
    }
}
