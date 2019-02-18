using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using Newtonsoft.Json;
namespace Makro.Models
{
    public class Answer
    {
        [JsonIgnore]
        public int Id { get; set; }
        [Required]
        public string UUID { get; set; }
        [Required]
        public User User { get; set; }
        public Question Question { get; set; }
        public ICollection<Comment> Comments { get; set; }
        [Required]
        public string AnswerBody { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
