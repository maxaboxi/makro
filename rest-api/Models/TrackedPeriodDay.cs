using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Makro.Models
{
    public class TrackedPeriodDay
    {
        public int Id { get; set; }
        public int TrackedPeriodId { get; set; }
        public TrackedPeriod TrackedPeriod { get; set; }
        public int DayId { get; set; }
        public Day Day { get; set; }
    }
}
