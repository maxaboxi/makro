using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
namespace Makro.Models
{
    public class Article
    {
        public int Id { get; set; }
        [Required]
        public User User { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public string Body { get; set; }
        public ICollection<ArticleImage> Images { get; set; }
        public ICollection<Comment> Comments { get; set; }
        [Required]
        public List<string> Tags { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
