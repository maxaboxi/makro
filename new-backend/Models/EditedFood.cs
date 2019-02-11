using System.ComponentModel.DataAnnotations;
namespace Makro.Models
{
    public class EditedFood : Food
    {
        [Required]
        public bool WaitingForApproval { get; set; }
        [Required]
        public string ReasonForEditing { get; set; }
        [Required]
        public User EditedBy { get; set; }
        public string EnglishTranslation { get; set; }
    }
}
