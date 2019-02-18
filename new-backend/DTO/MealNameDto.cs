using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
namespace Makro.Dto
{
    public class MealNameDto
    {
        [Required]
        public string UUID { get; set; }
        [Required]
        public string Name { get; set; }
    }
}
