using System;

namespace Makro.DTO
{
    public class SharedDayDto
    {
        public string UUID { get; set; }
        public string UserUUID { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
