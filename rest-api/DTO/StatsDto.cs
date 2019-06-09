using System.Collections.Generic;

namespace Makro.DTO
{
    public class StatsDto
    {
        public int Users { get; set; }
        public int Foods { get; set; }
        public int Days { get; set; }
        public int PDF { get; set; }
        public int MaleCount { get; set; }
        public int FemaleCount { get; set; }
        public double AverageAge { get; set; }
        public decimal AverageHeight { get; set; }
        public decimal AverageWeight { get; set; }
        public List<TopFoodsDto> TopFoods { get; set; }
    }
}
