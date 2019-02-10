using System;
using System.ComponentModel.DataAnnotations;
namespace Makro.Models
{
    public class Like
    {
        public int Id { get; set; }
        [Required]
        public User User { get; set; }
        [Required]
        public int Value { get; set; }
        public Article Article { get; set; }
        public Answer Answer { get; set; }
        public Comment Comment { get; set; }
        public SharedMeal SharedMeal { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
