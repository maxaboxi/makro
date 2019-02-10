using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
namespace Makro.Models
{
    public class Answer
    {
        public int Id { get; set; }
        [Required]
        public User User { get; set; }
        [Required]
        public Question Question { get; set; }
        public ICollection<Comment> Comments { get; set; }
        [Required]
        public string AnswerBody { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
