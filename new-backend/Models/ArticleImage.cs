using System.ComponentModel.DataAnnotations;
namespace Makro.Models
{
    public class ArticleImage
    {
        public int Id { get; set; }
        [Required]
        public Article Article { get; set; }
        [Required]
        public byte[] Image { get; set; }
    }
}
