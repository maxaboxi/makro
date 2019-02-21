namespace Makro.DTO
{
    public class ResultDto
    {
        public bool Success { get; set; }
        public string Message { get; set; }

        public ResultDto(bool success, string message)
        {
            Message = message;
            Success = success;
        }
    }
}
