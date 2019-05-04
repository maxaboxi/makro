using System;
using System.ComponentModel.DataAnnotations;
namespace Makro.DTO
{
    public class FeedbackDto
    {
        public string UUID { get; set; }
        public string UserId { get; set; }
        public string Username { get; set; }
        [Required]
        public string FeedbackBody { get; set; }
        public string Answer { get; set; }
        public string AnsweredBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime AnsweredAt { get; set; }
        public DateTime AnswerUpdatedAt { get; set; }
    }
}
