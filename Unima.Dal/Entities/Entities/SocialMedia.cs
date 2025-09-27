namespace Unima.Dal.Entities.Entities
{
    public class SocialMedia
    {
        public int Id { get; set; }

        public string? OfficePhoneNumber { get; set; }

        public string? PhoneNumber { get; set; }

        public string? Email { get; set; }

        public string? Telegram { get; set; }

        public string? Linkedin { get; set; }

        public string? GoogleScholar { get; set; }

        public required int ProfessorId { get; set; }
        public ProfessorInformation Professor { get; set; }
    }
}