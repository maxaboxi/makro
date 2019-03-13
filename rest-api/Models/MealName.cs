using System;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
namespace Makro.Models
{
    public class MealName
    {
        [JsonIgnore]
        public int Id { get; set; }
        [Required]
        public string UUID { get; set; }
        [Required]
        [JsonIgnore]
        public User User { get; set; }
        [Required]
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public MealName(string name)
        {
            Name = name;
            UUID = Guid.NewGuid().ToString();
            CreatedAt = DateTime.Now;
            UpdatedAt = DateTime.Now;
        }

        public MealName(string name, User user)
        {
            Name = name;
            User = user;
            UUID = Guid.NewGuid().ToString();
            CreatedAt = DateTime.Now;
            UpdatedAt = DateTime.Now;
        }
    }
}
