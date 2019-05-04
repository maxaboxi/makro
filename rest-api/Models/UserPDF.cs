using System;

namespace Makro.Models
{
    public class UserPDF
    {
        public int Id { get; set; }
        public string UUID { get; set; }
        public User User { get; set; }
        public Day Day { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
