using System;
namespace Makro.DTO
{
    public class CommentDto
    {
        public string UUID { get; set; }
        public string UserId { get; set; }
        public string Username { get; set; }
        public string Body { get; set; }
        public string AnswerUUID { get; set; }
        public string ArticleUUID { get; set; }
        public string ReplyToUUID { get; set; }
        public int CommentReplyCount { get; set; }
        public int TotalPoints { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
