using System;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
namespace Makro.Models
{
    public class Comment
    {
        [JsonIgnore]
        public int Id { get; set; }
        [Required]
        public string UUID { get; set; }
        [Required]
        public User User { get; set; }
        [Required]
        public string Body { get; set; }
        public Answer Answer { get; set; }
        public Article Article { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
