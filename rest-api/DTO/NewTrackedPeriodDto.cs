using System;
using System.Collections.Generic;

namespace Makro.DTO
{
    public class NewTrackedPeriodDto
    {
        public string UUID { get; set; }
        public List<string> DayIds { get; set; }
        public string Name { get; set; }
    }
}
