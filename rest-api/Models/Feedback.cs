﻿using System;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
namespace Makro.Models
{
    public class Feedback
    {
        [JsonIgnore]
        public int Id { get; set; }
        [Required]
        public string UUID { get; set; }
        [Required]
        public User User { get; set; }
        [Required]
        public string FeedbackBody { get; set; }
        public string Answer { get; set; }
        public bool Anonymous { get; set; }
        public User AnsweredBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime AnsweredAt { get; set; }
        public DateTime AnswerUpdatedAt { get; set; }
    }
}
