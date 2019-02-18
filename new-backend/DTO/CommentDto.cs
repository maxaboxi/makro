using System;
namespace Makro.DTO
{
    public class CommentDto
    {
        public string UUID { get; set; }
        public string UserId { get; set; }
        public string Username { get; set; }
        public string Body { get; set; }
        public string AnswerId { get; set; }
        public string ArticleId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
