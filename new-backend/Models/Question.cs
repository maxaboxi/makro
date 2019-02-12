using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
namespace Makro.Models
{
    public class Question
    {
        public int Id { get; set; }
        [Required]
        public string UUID { get; set; }
        [Required]
        public User User { get; set; }
        [Required]
        public string QuestionBody { get; set; }
        public string QuestionInformation { get; set; }
        public ICollection<Answer> Answers { get; set; }
        [Required]
        public List<string> Tags { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
