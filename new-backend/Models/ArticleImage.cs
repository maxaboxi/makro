using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
namespace Makro.Models
{
    public class ArticleImage
    {
        [JsonIgnore]
        public int Id { get; set; }
        [Required]
        public string UUID { get; set; }
        [Required]
        public Article Article { get; set; }
        [Required]
        public byte[] Image { get; set; }
    }
}
