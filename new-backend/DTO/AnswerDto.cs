using System;
using System.Collections.Generic;
namespace Makro.DTO
{
    public class AnswerDto
    {
        public string UUID { get; set; }
        public string UserId { get; set; }
        public string Username { get; set; }
        public List<CommentDto> Comments { get; set; }
        public string AnswerBody { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
