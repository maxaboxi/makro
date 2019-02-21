using System;
using System.Collections.Generic;
namespace Makro.DTO
{
    public class QuestionDto
    {
        public string UUID { get; set; }
        public string UserId { get; set; }
        public string Username { get; set; }
        public string QuestionBody { get; set; }
        public string QuestionInformation { get; set; }
        public List<AnswerDto> Answers { get; set; }
        public List<string> Tags { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
