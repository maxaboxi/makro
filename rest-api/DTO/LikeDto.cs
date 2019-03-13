using System;
namespace Makro.DTO
{
    public class LikeDto
    {
        public string UUID { get; set; }
        public string UserUUID { get; set; }
        public string Username { get; set; }
        public int Value { get; set; }
        public string SharedMealUUID { get; set; }
        public string LikedContent { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
