namespace Makro.DTO
{
    public class ResetPasswordDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string PasswordResetToken { get; set; }
    }
}
