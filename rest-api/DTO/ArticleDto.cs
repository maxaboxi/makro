using System;
using System.Collections.Generic;
namespace Makro.DTO
{
    public class ArticleDto
    {
        public string UUID { get; set; }
        public string UserId { get; set; }
        public string Username { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
        public List<ArticleImageDto> Images { get; set; }
        public List<CommentDto> Comments { get; set; }
        public int TotalPoints { get; set; }
        public int UserLike { get; set; }
        public List<string> Tags { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
